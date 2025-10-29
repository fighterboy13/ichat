// controllers/messageProcessor.js
import { logger } from "../utils/logger.js";

export async function pollInbox(ig, handler) {
  try {
    const inbox = await ig.feed.directInbox().items();

    for (const thread of inbox) {
      const threadId = thread.thread_id;
      const items = thread.items || [];

      for (const msg of items) {
        if (msg.text) {
          logger.info(`[MSG] ${msg.user_id}: ${msg.text}`);

          await handler(threadId, msg.user_id, msg.text);
        }
      }
    }
  } catch (e) {
    logger.error(`[IG-BOT] Inbox error: ${e.message}`);
  }
}
