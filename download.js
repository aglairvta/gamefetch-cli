const fs = require('fs');
const cliProgress = require('cli-progress');
const fetch = require('node-fetch');

async function baixarArquivo(url, nomeArquivo, nomeJogo) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow'
  });

  if (!res.ok) throw new Error(`Erro ao baixar: ${res.status} ${res.statusText}`);

  const total = parseInt(res.headers.get('content-length'), 10);
  const fileStream = fs.createWriteStream(nomeArquivo);

  const progressBar = new cliProgress.SingleBar({
    format: '{bar} {percentage}% | {value}/{total} bytes',
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
    clearOnComplete: true,
    linewrap: true
  });

  if (total) progressBar.start(total, 0);

  return new Promise((resolve, reject) => {
    let baixado = 0;
    res.body.on('data', (chunk) => {
      fileStream.write(chunk);
      baixado += chunk.length;
      if (total) progressBar.update(baixado);
    });

    res.body.on('end', () => {
      fileStream.end();
      if (total) progressBar.stop();
      resolve();
    });

    res.body.on('error', (err) => {
      if (total) progressBar.stop();
      reject(err);
    });
  });
}

module.exports = { baixarArquivo };