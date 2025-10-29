import 'dotenv/config';
import fs from 'fs-extra';
import { IgApiClient } from 'instagram-private-api';

const ig = new IgApiClient();

async function run() {
  const sessionPath = process.env.SESSION_PATH || './data/session.json';
  if (await fs.pathExists(sessionPath)) {
    const serialized = await fs.readJson(sessionPath);
    await ig.state.deserialize(serialized);
    const me = await ig.account.currentUser();
    console.log('Your numeric id (pk):', me.pk);
  } else {
    console.log('Session not found — run bot once to create session or use login script.');
  }
}
run().catch(console.error);
