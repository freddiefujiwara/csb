#!/usr/bin/env node
import { Chromeless } from 'chromeless';

if (process.argv.length !== 4) {
  console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <yahoo japan id> <yahoo japan password>`);
  process.exit(1);
}

const yid = process.argv[2];
const password = process.argv[3];

async function run() {
  const chromeless = new Chromeless();
  const html = await chromeless
    .goto('https://my.softbank.jp/msb/d/logout/send')
    .wait('#logintop')
    .goto('https://login.yahoo.co.jp/config/login?.lg=jp&.intl=jp&logout=1&.src=www&.done=https://www.yahoo.co.jp/')
    .goto('https://my.softbank.jp/msb/d/webLink/doSend/WMS010001')
    .wait('input[type="image"]')
    .click('input[type="image"]')
    .wait('input#username')
    .type(yid, 'input#username')
    .click('button#btnNext')
    .wait(1000)
    .type(password, 'input#passwd')
    .click('button#btnSubmit')
    .wait(10000)
    .html();
  await chromeless.end();

  const match = html.match(/ow-icon-mail-folderColumn-unreadCount">([0-9]+)/);
  if (match && match.length > 1) {
    return match[1];
  }
  return 0;
}

run()
  .then((result) => {
    console.log(result);
    process.exit(result > 0 ? 1 : 0);
  })
  .catch(console.error.bind(console));