import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import { IgApiClient } from 'instagram-private-api';
import { log } from './utils/logger.js';
import { loginInstagram } from './controllers/instagramClient.js';
import { processMessage } from './controllers/messageProcessor.js';

const SESSION_PATH = process.env.SESSION_PATH || './data/session.json';

async function startBot() {
  const ig = new IgApiClient();

  try {
    log('Starting Instagram Group Locker Bot...');

    if (await fs.pathExists(SESSION_PATH)) {
      log('Loading saved session...');
      const serialized = await fs.readJson(SESSION_PATH);
      await ig.state.deserialize(serialized);
      log('Session loaded.');
    } else {
      await loginInstagram(ig);
    }

    // basic inbox polling loop (simple, not streaming)
    log('Bot is ready. Starting inbox poll (every 10s).');
    setInterval(async () => {
      try {
        const inboxFeed = ig.feed.directInbox();
        const inbox = await inboxFeed.items();
        if (!inbox || !inbox.length) return;
        for (const thread of inbox) {
          // fetch recent items/messages for the thread
          const threadObj = await ig.directThread.show(thread.thread_id);
          const items = threadObj.items || [];
          for (const msg of items) {
            await processMessage(ig, threadObj, msg);
          }
        }
      } catch (err) {
        log('Error polling inbox:', err.message);
      }
    }, 10000);
  } catch (err) {
    console.error(err);
    log('❌ Error starting bot:', err.message);
    process.exit(1);
  }
}

startBot();
