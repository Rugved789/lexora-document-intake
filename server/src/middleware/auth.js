import { clerkClient } from '@clerk/clerk-sdk-node';
import { config } from '../config/index.js';

/**
 * Authentication Middleware using Clerk
 * 
 * Verifies the Clerk session token and attaches user info to the request.
 * All protected routes should use this middleware.
 */
export async function requireAuth(req, res, next) {
  try {
    // Get the session token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No authentication token provided'
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Clerk
    const sessionClaims = await clerkClient.verifyToken(token, {
      secretKey: config.clerkSecretKey
    });

    if (!sessionClaims || !sessionClaims.sub) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token'
        }
      });
    }

    // Attach user ID to request
    req.userId = sessionClaims.sub;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Authentication failed'
      }
    });
  }
}
