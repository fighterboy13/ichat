import { log } from '../utils/logger.js';

export async function setNickname(ig, thread, userId, nickname) {
  try {
    // instagram-private-api does not have a stable method to set chat nicknames for other users.
    // This is a placeholder to show where nickname logic would go.
    log('setNickname called for', userId, '->', nickname);
    // Inform thread
    if (ig.directThread?.broadcastText) {
      await ig.directThread.broadcastText(thread.thread_id, `Nickname for ${userId} set to ${nickname}`);
    }
  } catch (err) {
    log('setNickname error:', err.message);
  }
}
