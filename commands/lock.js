export async function lockCommand(ig, thread) {
  // Simple wrapper — actual logic in controllers/threadLocker.js
  const { lockThread } = await import('../controllers/threadLocker.js');
  return lockThread(ig, thread);
}
