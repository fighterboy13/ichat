export async function unlockCommand(ig, thread) {
  const { unlockThread } = await import('../controllers/threadLocker.js');
  return unlockThread(ig, thread);
}
