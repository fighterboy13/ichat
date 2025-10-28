import 'dotenv/config';

export const CONFIG = {
  USERNAME: process.env.INSTAGRAM_USERNAME,
  PASSWORD: process.env.INSTAGRAM_PASSWORD,
  ADMIN_ID: process.env.ADMIN_ID,
  SESSION_PATH: process.env.SESSION_PATH || './data/session.json',
};
