// controllers/threadLocker.js
import { logger } from "../utils/logger.js";

export class ThreadLocker {
  constructor(ig) {
    this.ig = ig;
    this.lockedThreads = new Set(); // locked group list
  }

  lockThread(threadId) {
    this.lockedThreads.add(threadId);
    logger.info(`🔒 Thread Locked: ${threadId}`);
  }

  unlockThread(threadId) {
    if (this.lockedThreads.has(threadId)) {
      this.lockedThreads.delete(threadId);
      logger.info(`✅ Thread Unlocked: ${threadId}`);
    }
  }

  isLocked(threadId) {
    return this.lockedThreads.has(threadId);
  }

  async reAddRemovedUser(threadId, userId) {
    try {
      const thread = this.ig.directThread.getById(threadId);
      await thread.addUser([userId]);

      logger.info(`👥 Re-added removed user ${userId} to ${threadId}`);
    } catch (e) {
      logger.error(`⚠️ Failed re-add user ${userId}: ${e.message}`);
    }
  }

  async getThreadInfo(threadId) {
    try {
      const thread = this.ig.directThread.getById(threadId);
      const items = await thread.items();

      return {
        id: threadId,
        messages: items.length,
      };
    } catch (e) {
      logger.error("[ThreadInfo]", e.message);
      return null;
    }
  }

  async monitorInbox(callback) {
    setInterval(async () => {
      try {
        const inboxFeed = await this.ig.feed.directInbox();
        const threads = await inboxFeed.items();

        for (const thread of threads) {
          const threadId = thread.thread_id;

          if (this.isLocked(threadId)) {
            await callback(thread);
          }
        }
      } catch (e) {
        logger.error(`[IG-BOT] Error polling inbox: ${e.message}`);
      }
    }, 10_000);
  }
        }
