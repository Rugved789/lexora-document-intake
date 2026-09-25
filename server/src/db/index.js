import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton
 * Ensures only one instance exists throughout the application
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

export default prisma;
