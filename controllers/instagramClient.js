// controllers/instagramClient.js
import fs from 'fs-extra';
import { IgApiClient } from 'instagram-private-api';
import { log } from '../utils/logger.js';

const SESSION_PATH = process.env.SESSION_PATH || './data/session.json';

export async function loginInstagram(ig) {
  try {
    ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
    log('Logging in to Instagram...');

    const auth = await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
    log('Logged in as', auth.username);

    const serialized = await ig.state.serialize();
    delete serialized.constants;
    await fs.outputJson(SESSION_PATH, serialized);
    log('✅ Session saved to', SESSION_PATH);

    return ig;
  } catch (err) {
    log('Login failed:', err.message || err);
    throw err;
  }
}
