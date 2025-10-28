import { log } from '../utils/logger.js';

export async function lockThread(ig, thread) {
  try {
    log('Locking thread', thread.thread_id);
    // Update title if supported
    if (ig.directThread?.updateTitle) {
      try {
        await ig.directThread.updateTitle(thread.thread_id, '🔒 Group Locked');
      } catch (e) {
        log('updateTitle not supported or failed:', e.message);
      }
    }
    # Broadcast a message to thread
    if (ig.directThread?.broadcastText) {
      await ig.directThread.broadcastText(thread.thread_id, '🚫 Group is now locked by admin.');
    } else {
      await ig.entity.directThread(thread.thread_id).broadcastText('🚫 Group is now locked by admin.');
    }
    log('Thread locked:', thread.thread_id);
  } catch (err) {
    log('lockThread error:', err.message);
  }
}

export async function unlockThread(ig, thread) {
  try {
    log('Unlocking thread', thread.thread_id);
    if (ig.directThread?.updateTitle) {
      try {
        await ig.directThread.updateTitle(thread.thread_id, '✅ Group Unlocked');
      } catch (e) {
        log('updateTitle failed:', e.message);
      }
    }
    if (ig.directThread?.broadcastText) {
      await ig.directThread.broadcastText(thread.thread_id, '✅ Group is now unlocked.');
    } else {
      await ig.entity.directThread(thread.thread_id).broadcastText('✅ Group is now unlocked.');
    }
    log('Thread unlocked:', thread.thread_id);
  } catch (err) {
    log('unlockThread error:', err.message);
  }
}
