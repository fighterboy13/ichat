export async function setNickname(ig, thread, userId, nickname) {
  const { setNickname } = await import('../controllers/nicknameManager.js');
  return setNickname(ig, thread, userId, nickname);
}
