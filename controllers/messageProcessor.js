import { lockThread, unlockThread } from './threadLocker.js';
import { sendWelcome } from './welcomeHandler.js';
import { log } from '../utils/logger.js';

export async function processMessage(ig, thread, msg) {
  try {
    const text = (msg.text || '').toString().trim();
    if (!text) return;

    const lower = text.toLowerCase();
    log('Message received in thread', thread.thread_id, '->', text);

    // admin-only commands check (basic)
    const adminId = process.env.ADMIN_ID ? process.env.ADMIN_ID.toString() : null;
    const fromUserId = msg.user_id ? msg.user_id.toString() : (msg.user_id || msg.user?.pk || '').toString();

    if (lower === '!lock') {
      if (adminId && adminId !== fromUserId) {
        log('Non-admin attempted lock:', fromUserId);
        await ig.directThread.broadcastText(thread.thread_id, 'Only admin can use this command.');
        return;
      }
      await lockThread(ig, thread);
    } else if (lower === '!unlock') {
      if (adminId && adminId !== fromUserId) {
        await ig.directThread.broadcastText(thread.thread_id, 'Only admin can use this command.');
        return;
      }
      await unlockThread(ig, thread);
    } else if (lower.includes('hello') || lower === 'hi' || lower === 'hey') {
      await sendWelcome(ig, thread, fromUserId);
    }

  } catch (err) {
    log('processMessage error:', err.message);
  }
}
