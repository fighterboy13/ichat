export function isAdmin(userId) {
  const admin = process.env.ADMIN_ID ? process.env.ADMIN_ID.toString() : null;
  return admin && admin === userId?.toString();
}
