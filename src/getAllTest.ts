import * as dotenv from 'dotenv';
import path from 'path';

import { list } from './lib/get';
import { getSession } from './lib/session';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const run = async () => {
  const session = await getSession();
  const start = new Date().getTime();
  const maskedEmails = await list(session);
  const end = new Date().getTime();
  console.log(`Got ${maskedEmails.length} masked emails in ${end - start}ms`);
};

run();
