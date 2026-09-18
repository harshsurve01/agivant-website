const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    });
  });
}

async function run() {
  const css1 = await fetchUrl('/_next/static/chunks/src_1gb5n0e._.css');
  let idx = css1.indexOf('LifecycleModal');
  while (idx !== -1) {
    console.log('--- LifecycleModal match ---:');
    console.log(css1.substring(idx - 30, idx + 350));
    idx = css1.indexOf('LifecycleModal', idx + 1);
  }
}

run();
