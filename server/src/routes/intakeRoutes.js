import express from 'express';
import * as intakeController from '../controllers/intakeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Intake session routes
router.post('/intakes', intakeController.createIntake);
router.get('/intakes', intakeController.getIntakes);
router.get('/intakes/:id', intakeController.getIntake);
router.delete('/intakes/:id', intakeController.deleteIntake);

// Message routes
router.post('/intakes/:id/messages', intakeController.sendMessage);

// State routes
router.patch('/intakes/:id/state', intakeController.updateState);

// Document routes
router.get('/intakes/:id/document', intakeController.getDocument);

// State history routes
router.get('/intakes/:id/history', intakeController.getStateHistory);

export default router;
