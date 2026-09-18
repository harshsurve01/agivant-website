const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    const links = [];
    let pos = 0;
    while ((pos = data.indexOf('.css', pos)) !== -1) {
      const start = data.lastIndexOf('"', pos);
      const end = data.indexOf('"', pos);
      links.push(data.substring(start + 1, end));
      pos = end + 1;
    }
    console.log('Found CSS links:', Array.from(new Set(links)));
  });
});
