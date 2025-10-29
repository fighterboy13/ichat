// controllers/welcomeHandler.js
import { safeBroadcast } from './threadLocker.js';
import { log } from '../utils/logger.js';

export async function sendWelcome(ig, threadId, userId) {
  try {
    const msg = process.env.WELCOME_MESSAGE || 'Welcome! 👋';
    await safeBroadcast(ig, threadId, msg);
    log('Sent welcome to', userId, 'in', threadId);
  } catch (e) {
    log('sendWelcome error:', e.message || e);
  }
}
