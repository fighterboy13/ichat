import { log } from '../utils/logger.js';

export async function sendWelcome(ig, thread, userId) {
  try {
    const text = `Welcome! If you are new here, say hi 👋`;
    if (ig.directThread?.broadcastText) {
      await ig.directThread.broadcastText(thread.thread_id, text);
    } else {
      await ig.entity.directThread(thread.thread_id).broadcastText(text);
    }
    log('Sent welcome to', userId, 'in', thread.thread_id);
  } catch (err) {
    log('sendWelcome error:', err.message);
  }
}
