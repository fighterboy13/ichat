// controllers/messageProcessor.js
import { log } from '../utils/logger.js';
import { safeBroadcast } from './threadLocker.js';
import { sendWelcome } from './welcomeHandler.js';
import { isAdmin } from '../middlewares/adminAuth.js';

const AUTOREPLY_ENABLED = (process.env.AUTOREPLY_ENABLED || 'true') === 'true';
const AUTOREPLY_TRIGGER = (process.env.AUTOREPLY_TRIGGER || 'help').toLowerCase();
const AUTOREPLY_MESSAGE = process.env.AUTOREPLY_MESSAGE || 'Thanks — admin will check.';

export async function pollInbox(ig, locker, handler) {
  try {
    const inboxFeed = ig.feed.directInbox();
    const inbox = await inboxFeed.items();

    if (!Array.isArray(inbox) || inbox.length === 0) return;

    for (const thread of inbox) {
      const threadId = thread.thread_id;
      // thread.items may already be included
      const items = thread.items || (await (ig.directThread.getById(threadId)).items());

      for (const msg of items) {
        // skip system events
        if (!msg || (!msg.text && !msg.item_type)) continue;
        // handle only text messages for now
        const text = (msg.text || '').toString().trim();
        const fromUser = msg.user_id || msg.user?.pk || msg.user?.id || null;

        // run handler (user supplied logic)
        if (typeof handler === 'function') {
          try {
            await handler({ ig, locker, thread, threadId, msg, text, fromUser });
          } catch (e) {
            log('handler error:', e.message || e);
          }
        }

        // built-in commands (simple)
        if (text === '!lock') {
          if (!isAdmin(String(fromUser))) {
            await safeBroadcast(ig, threadId, 'Only admin can use this command.');
          } else {
            await locker.lockThread(threadId, fromUser);
          }
          continue;
        }

        if (text === '!unlock') {
          if (!isAdmin(String(fromUser))) {
            await safeBroadcast(ig, threadId, 'Only admin can use this command.');
          } else {
            await locker.unlockThread(threadId, fromUser);
          }
          continue;
        }

        // welcome: if someone says hi
        if (/^(hi|hello|hey)\b/i.test(text)) {
          if ((process.env.ENABLE_WELCOME || 'true') === 'true') {
            await sendWelcome(ig, threadId, fromUser);
          }
          continue;
        }

        // autoreply trigger
        if (AUTOREPLY_ENABLED && text.toLowerCase().includes(AUTOREPLY_TRIGGER)) {
          await safeBroadcast(ig, threadId, AUTOREPLY_MESSAGE);
        }
      }
    }
  } catch (e) {
    log('[IG-BOT] Error polling inbox:', e.message || e);
  }
}

// exported handler example for custom logic
export async function handleMessage({ ig, locker, thread, threadId, msg, text, fromUser }) {
  // placeholder: currently nothing besides builtins — you can extend here.
  // e.g., log, forward to admin, update nicknames, etc.
  log('handleMessage:', threadId, fromUser, text);
}
