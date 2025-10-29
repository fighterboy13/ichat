// middlewares/adminAuth.js
export function isAdmin(userId) {
  if (!process.env.ADMIN_ID) return false;
  return String(userId) === String(process.env.ADMIN_ID);
}
