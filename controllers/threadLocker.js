// src/controllers/threadLocker.js
import fs from "fs-extra";
import path from "path";

// Thread lock file path
const lockFilePath = path.join("data", "thread_locks.json");

/**
 * Load current thread lock data from file
 */
export async function loadThreadLocks() {
  try {
    if (await fs.pathExists(lockFilePath)) {
      return await fs.readJson(lockFilePath);
    }
  } catch (err) {
    console.error("Error reading thread lock file:", err.message);
  }
  return {};
}

/**
 * Save thread lock data to file
 */
export async function saveThreadLocks(locks) {
  try {
    await fs.ensureFile(lockFilePath);
    await fs.writeJson(lockFilePath, locks, { spaces: 2 });
  } catch (err) {
    console.error("Error saving thread lock file:", err.message);
  }
}

/**
 * Lock a thread for processing
 * @param {string} threadId
 */
export async function lockThread(threadId) {
  const locks = await loadThreadLocks();
  locks[threadId] = true;
  await saveThreadLocks(locks);
}

/**
 * Unlock a thread
 * @param {string} threadId
 */
export async function unlockThread(threadId) {
  const locks = await loadThreadLocks();
  delete locks[threadId];
  await saveThreadLocks(locks);
}

/**
 * Check if thread is locked
 * @param {string} threadId
 * @returns {boolean}
 */
export async function isThreadLocked(threadId) {
  const locks = await loadThreadLocks();
  return !!locks[threadId];
}
