import prisma from '../../db/index.js';
import { initialStructuredState, validateStructuredState, mergeStateUpdates } from '../../schemas/structuredState.js';

/**
 * Intake Service
 * Handles all database operations for intake sessions
 */

/**
 * Helper to retry database queries against transient Neon cold-starts or connection drops
 */
async function withDbRetry(fn, retries = 2, delay = 600) {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isTransient =
        error.code === 'P1001' || // Can't reach database server
        error.code === 'P1002' || // Database server timed out
        error.code === 'P1008' || // Operations timed out
        error.code === 'P1017' || // Server closed connection
        error.message?.includes('closed') ||
        error.message?.includes('Connection') ||
        error.message?.includes('timeout') ||
        error.name === 'PrismaClientInitializationError';

      if (attempt <= retries && isTransient) {
        console.warn(`[Prisma/Neon] Transient connection issue on attempt ${attempt}. Retrying in ${delay * attempt}ms...`);
        await new Promise(res => setTimeout(res, delay * attempt));
        continue;
      }
      throw error;
    }
  }
}

/**
 * Create a new intake session for a user
 */
export async function createIntakeSession(clerkUserId, title = 'New Intake') {
  return withDbRetry(async () => {
    const session = await prisma.intakeSession.create({
      data: {
        clerkUserId,
        title,
        structuredStates: {
          create: {
            stateJson: JSON.stringify(initialStructuredState),
            version: 1
          }
        }
      },
      include: {
        structuredStates: true,
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return session;
  });
}

/**
 * Get all intake sessions for a user
 */
export async function getUserIntakeSessions(clerkUserId) {
  return withDbRetry(async () => {
    const sessions = await prisma.intakeSession.findMany({
      where: { clerkUserId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1
        },
        structuredStates: {
          select: {
            version: true,
            updatedAt: true
          }
        }
      }
    });

    return sessions;
  });
}

/**
 * Get a single intake session with all data
 */
export async function getIntakeSession(id, clerkUserId) {
  const session = await prisma.intakeSession.findFirst({
    where: {
      id,
      clerkUserId
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      structuredStates: {
        orderBy: { version: 'desc' }
      }
    }
  });

  return session;
}

/**
 * Get the current structured state for a session
 */
export async function getCurrentState(intakeSessionId) {
  const state = await prisma.structuredState.findFirst({
    where: { intakeSessionId },
    orderBy: { version: 'desc' }
  });

  if (!state) {
    return initialStructuredState;
  }

  return JSON.parse(state.stateJson);
}

/**
 * Get current version number for an intake session
 */
export async function getCurrentVersion(intakeSessionId) {
  const latest = await prisma.structuredState.findFirst({
    where: { intakeSessionId },
    orderBy: { version: 'desc' },
    select: { version: true }
  });

  return latest?.version || 1;
}

/**
 * Update the structured state for a session
 */
export async function updateStructuredState(intakeSessionId, updates) {
  const latest = await prisma.structuredState.findFirst({
    where: { intakeSessionId },
    orderBy: { version: 'desc' }
  });

  const currentState = latest ? JSON.parse(latest.stateJson) : initialStructuredState;
  
  // Merge updates with current state
  const newState = mergeStateUpdates(currentState, updates);

  const newVersion = (latest?.version || 0) + 1;

  // Record a new state version snapshot in the database
  await prisma.structuredState.create({
    data: {
      intakeSessionId,
      stateJson: JSON.stringify(newState),
      version: newVersion
    }
  });

  return {
    state: newState,
    version: newVersion
  };
}

/**
 * Add a message to the conversation
 */
export async function addConversationMessage(intakeSessionId, role, content) {
  const message = await prisma.conversationMessage.create({
    data: {
      intakeSessionId,
      role,
      content
    }
  });

  // Update session timestamp
  await prisma.intakeSession.update({
    where: { id: intakeSessionId },
    data: { updatedAt: new Date() }
  });

  return message;
}

/**
 * Get conversation history for a session
 */
export async function getConversationHistory(intakeSessionId) {
  const messages = await prisma.conversationMessage.findMany({
    where: { intakeSessionId },
    orderBy: { createdAt: 'asc' }
  });

  return messages;
}

/**
 * Delete an intake session
 */
export async function deleteIntakeSession(id, clerkUserId) {
  const result = await prisma.intakeSession.deleteMany({
    where: {
      id,
      clerkUserId
    }
  });

  return result.count > 0;
}

/**
 * Verify session ownership
 */
export async function verifySessionOwnership(intakeSessionId, clerkUserId) {
  const session = await prisma.intakeSession.findFirst({
    where: {
      id: intakeSessionId,
      clerkUserId
    }
  });

  return session !== null;
}


/**
 * Get state history for an intake session
 */
export async function getStateHistory(intakeSessionId) {
  const history = await prisma.structuredState.findMany({
    where: { intakeSessionId },
    orderBy: { version: 'desc' },
    select: {
      version: true,
      stateJson: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return history.map(h => ({
    version: h.version,
    state: JSON.parse(h.stateJson),
    createdAt: h.createdAt,
    updatedAt: h.updatedAt
  }));
}
