export async function autoReply(ig, thread, msg) {
  // placeholder for word-based autoresponse
  const text = msg.text || '';
  if (text.toLowerCase().includes('help')) {
    await ig.directThread.broadcastText(thread.thread_id, 'If you need help, contact the admin.');
  }
}
