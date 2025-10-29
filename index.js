import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import { IgApiClient } from 'instagram-private-api';
import { log } from './utils/logger.js';
import { loginInstagram } from './controllers/instagramClient.js';
import { pollInbox } from './controllers/messageProcessor.js';
import { ThreadLocker } from './controllers/threadLocker.js';
import { handleMessage } from './controllers/messageProcessor.js';

const SESSION_PATH = process.env.SESSION_PATH || './data/session.json';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL_MS || '10000', 10);

async function start() {
  const ig = new IgApiClient();

  try {
    log('Starting IG Group Locker Bot...');

    if (await fs.pathExists(SESSION_PATH)) {
      log('Loading saved session...');
      const serialized = await fs.readJson(SESSION_PATH);
      await ig.state.deserialize(serialized);
      log('Session deserialized.');
    } else {
      await loginInstagram(ig);
    }

    // prepare locker + start poll loop
    const locker = new ThreadLocker(ig);

    log('Bot is ready. Starting inbox poll every', POLL_INTERVAL, 'ms');

    // initial poll immediately, then interval
    await pollInbox(ig, locker, handleMessage);
    setInterval(() => pollInbox(ig, locker, handleMessage), POLL_INTERVAL);

  } catch (err) {
    log('Fatal error starting bot:', err.message || err);
    process.exit(1);
  }
}

start();
        
