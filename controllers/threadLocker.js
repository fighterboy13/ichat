// controllers/threadLocker.js
import fs from 'fs-extra';
import path from 'path';
import { log } from '../utils/logger.js';

const LOCKS_PATH = path.join('data', 'thread_locks.json');

export class ThreadLocker {
  constructor(ig) {
    this.ig = ig;
    this.locks = {};
    // load existing locks if any
    this._load();
  }

  async _load() {
    try {
      if (await fs.pathExists(LOCKS_PATH)) {
        this.locks = await fs.readJson(LOCKS_PATH);
      } else {
        this.locks = {};
      }
    } catch (e) {
      log('threadLocker load error:', e.message || e);
      this.locks = {};
    }
  }

  async _save() {
    try {
      await fs.outputJson(LOCKS_PATH, this.locks, { spaces: 2 });
    } catch (e) {
      log('threadLocker save error:', e.message || e);
    }
  }

  isLocked(threadId) {
    return !!this.locks[threadId];
  }

  async lockThread(threadId, byUser = null) {
    this.locks[threadId] = { lockedAt: Date.now(), by: byUser || null };
    await this._save();
    log('Locked thread', threadId);
    // broadcast
    await safeBroadcast(this.ig, threadId, '🔒 Group locked by admin.');
  }

  async unlockThread(threadId, byUser = null) {
    delete this.locks[threadId];
    await this._save();
    log('Unlocked thread', threadId);
    await safeBroadcast(this.ig, threadId, '✅ Group unlocked by admin.');
  }
}

// helper to send text robustly
export async function safeBroadcast(ig, threadId, text) {
  try {
    // try modern method
    if (ig.directThread && typeof ig.directThread.broadcastText === 'function') {
      await ig.directThread.broadcastText(threadId, text);
      return;
    }
    // fallback: get thread then broadcast via instance
    const thread = ig.directThread.getById(threadId);
    if (thread && typeof thread.broadcastText === 'function') {
      await thread.broadcastText(text);
      return;
    }
    // last resort: try entity
    if (ig.entity && typeof ig.entity.directThread === 'function') {
      await ig.entity.directThread(threadId).broadcastText(text);
      return;
    }
  } catch (e) {
    log('safeBroadcast error:', e.message || e);
  }
  }
