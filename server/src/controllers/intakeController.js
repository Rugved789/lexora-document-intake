import * as intakeService from '../services/intake/intakeService.js';
import { processLLMMessage } from '../services/llm/index.js';
import { generatePersonalWishesDocument, getCompletionStatus } from '../services/document/documentGenerator.js';
import { generatePersonalWishesPDF } from '../services/document/pdfGenerator.js';
import { CreateIntakeSchema, SendMessageSchema, UpdateStateSchema } from '../schemas/api.js';
import { AppError } from '../middleware/errorHandler.js';

/** Create a new intake session **/
export async function createIntake(req, res, next) {
  try {
    const { title } = CreateIntakeSchema.parse(req.body);

    const session = await intakeService.createIntakeSession(
      req.userId,
      title || 'New Intake'
    );

    const state = JSON.parse(session.structuredStates[0].stateJson);

    res.json({
      success: true,
      data: {
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
        state,
        messages: [],
        document: generatePersonalWishesDocument(state),
        completion: getCompletionStatus(state)
      }
    });
  } catch (error) {
    next(error);
  }
}

/**Get all intake sessions for the current user**/
export async function getIntakes(req, res, next) {
  try {
    const sessions = await intakeService.getUserIntakeSessions(req.userId);

    const formatted = sessions.map(session => ({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session.messages.length
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}

/** Get a specific intake session**/
export async function getIntake(req, res, next) {
  try {
    const { id } = req.params;

    const session = await intakeService.getIntakeSession(id, req.userId);

    if (!session) {
      throw new AppError('Intake session not found', 404, 'NOT_FOUND');
    }

    const state = JSON.parse(session.structuredStates[0].stateJson);

    res.json({
      success: true,
      data: {
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        state,
        version: session.structuredStates[0]?.version || 1,
        messages: session.messages,
        document: generatePersonalWishesDocument(state),
        completion: getCompletionStatus(state)
      }
    });
  } catch (error) {
    next(error);
  }
}

/** Send a message in an intake session
  This processes the message through the LLM and updates the state
 **/
export async function sendMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = SendMessageSchema.parse(req.body);

    // Verify ownership
    const hasAccess = await intakeService.verifySessionOwnership(id, req.userId);
    if (!hasAccess) {
      throw new AppError('Intake session not found', 404, 'NOT_FOUND');
    }

    // Save user message
    await intakeService.addConversationMessage(id, 'user', content);

    // Get current state and conversation history
    const currentState = await intakeService.getCurrentState(id);
    const conversationHistory = await intakeService.getConversationHistory(id);

    // Format conversation for LLM
    const conversation = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Process through LLM
    const llmResponse = await processLLMMessage({
      currentState,
      conversation,
      latestUserMessage: content
    });

    // Update structured state if there are updates
    let currentVersion = 1;
    if (llmResponse.stateUpdates && Object.keys(llmResponse.stateUpdates).length > 0) {
      const updateResult = await intakeService.updateStructuredState(id, llmResponse.stateUpdates);
      currentVersion = updateResult.version;
    } else {
      currentVersion = await intakeService.getCurrentVersion(id);
    }

    // Save assistant message
    await intakeService.addConversationMessage(id, 'assistant', llmResponse.assistantMessage);

    // Get updated state
    const updatedState = await intakeService.getCurrentState(id);
    const updatedMessages = await intakeService.getConversationHistory(id);

    res.json({
      success: true,
      data: {
        message: {
          role: 'assistant',
          content: llmResponse.assistantMessage
        },
        state: updatedState,
        version: currentVersion,
        messages: updatedMessages,
        document: generatePersonalWishesDocument(updatedState),
        completion: getCompletionStatus(updatedState)
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update structured state directly
 */
export async function updateState(req, res, next) {
  try {
    const { id } = req.params;
    const { updates } = UpdateStateSchema.parse(req.body);

    // Verify ownership
    const hasAccess = await intakeService.verifySessionOwnership(id, req.userId);
    if (!hasAccess) {
      throw new AppError('Intake session not found', 404, 'NOT_FOUND');
    }

    // Update state
    const result = await intakeService.updateStructuredState(id, updates);

    res.json({
      success: true,
      data: {
        state: result.state,
        version: result.version,
        document: generatePersonalWishesDocument(result.state),
        completion: getCompletionStatus(result.state)
      }
    });
  } catch (error) {
    next(error);
  }
}

/**Get the document for an intake session (PDF binary by default, or JSON if requested)**/
export async function getDocument(req, res, next) {
  try {
    const { id } = req.params;

    // Verify ownership
    const hasAccess = await intakeService.verifySessionOwnership(id, req.userId);
    if (!hasAccess) {
      throw new AppError('Intake session not found', 404, 'NOT_FOUND');
    }

    const session = await intakeService.getIntakeSession(id, req.userId);
    const state = await intakeService.getCurrentState(id);

    // If format=json explicitly requested, return legacy metadata/text
    if (req.query.format === 'json') {
      const document = generatePersonalWishesDocument(state);
      return res.json({
        success: true,
        data: {
          document,
          completion: getCompletionStatus(state)
        }
      });
    }

    const title = session?.title || 'Personal_Wishes_Document';
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_') || 'Personal_Wishes_Document';
    const filename = `${sanitizedTitle}.pdf`;

    // Generate real professional PDF binary
    const pdfBuffer = await generatePersonalWishesPDF(state, {
      title,
      sessionCreatedAt: session?.createdAt
    });

    const isDownload = req.query.download === 'true';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${isDownload ? 'attachment' : 'inline'}; filename="${filename}"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    return res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
}

/**Delete an intake session*/
export async function deleteIntake(req, res, next) {
  try {
    const { id } = req.params;

    const deleted = await intakeService.deleteIntakeSession(id, req.userId);

    if (!deleted) {
      throw new AppError('Intake session not found', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: { deleted: true }
    });
  } catch (error) {
    next(error);
  }
}


/**Get state history for an intake session*/
export async function getStateHistory(req, res, next) {
  try {
    const { id } = req.params;
    const clerkUserId = req.userId;

    // Verify ownership
    const hasAccess = await intakeService.verifySessionOwnership(id, clerkUserId);
    if (!hasAccess) {
      throw new AppError('Intake session not found', 404, 'NOT_FOUND');
    }

    const history = await intakeService.getStateHistory(id);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
}
