import fs from 'fs-extra';
import { IgApiClient } from 'instagram-private-api';
import { log } from '../utils/logger.js';

const SESSION_PATH = process.env.SESSION_PATH || './data/session.json';

export async function loginInstagram(ig) {
  try {
    log('Generating device and logging in...');
    ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);

    // Optional: challenge handlers (not implemented here)
    const auth = await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
    log('Logged in as', auth.username);

    const serialized = await ig.state.serialize();
    delete serialized.constants;
    await fs.outputJson(SESSION_PATH, serialized);
    log('Session saved to', SESSION_PATH);
  } catch (err) {
    log('Login error:', err.message);
    throw err;
  }
}
