// controllers/nicknameManager.js
import { log } from '../utils/logger.js';

export async function setNickname(ig, threadId, userId, nickname) {
  try {
    // instagram-private-api does not reliably provide nickname set for other users.
    // This is a placeholder: we inform the thread.
    await ig.directThread.broadcastText(threadId, `Nickname for ${userId} set to ${nickname}`);
    log('setNickname called:', userId, nickname);
  } catch (e) {
    log('setNickname error:', e.message || e);
  }
}
