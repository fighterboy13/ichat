export async function sendMessage(ig, threadId, text) {
  await ig.directThread.broadcastText(threadId, text);
}
