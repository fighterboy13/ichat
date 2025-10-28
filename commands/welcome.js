export async function welcomeCommand(ig, thread, userId) {
  const { sendWelcome } = await import('../controllers/welcomeHandler.js');
  return sendWelcome(ig, thread, userId);
}
