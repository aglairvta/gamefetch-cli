const path = require('path');
const fs = require('fs');

async function processarFlags(flag, jogos, ui, baixarArquivo) {
  if (flag === '-l') {
    ui.listarJogos(jogos);

    const escolha = ui.perguntarEscolha(jogos.length);
    if (escolha === 0) return;

    if (escolha < 1 || escolha > jogos.length) {
      console.log('Opção inválida!');
      return;
    }

    const jogoEscolhido = jogos[escolha - 1];
    await baixarPorJogo(jogoEscolhido, baixarArquivo);
  } 
  else if (flag.startsWith('-l')) {
    const id = parseInt(flag.slice(2), 10);
    if (isNaN(id)) {
      console.log('ID inválido. Use -h para ajuda.');
      return;
    }

    const jogoEscolhido = jogos[id - 1];

    if (!jogoEscolhido) {
      console.log('Jogo não encontrado para o ID informado.');
      return;
    }

    await baixarPorJogo(jogoEscolhido, baixarArquivo);
  } 
  else if (flag === '-h') {
    console.log('  -l         Listar todos os jogos');
    console.log('  -h         Mostrar ajuda');
  } 
  else {
    console.log('Flag inválida. Use -h para ajuda.');
  }
}

async function baixarPorJogo(jogo, baixarArquivo) {
  const linksPixeldrain = jogo.uris.filter(link => link.includes('pixeldrain'));
  if (linksPixeldrain.length === 0) {
    console.log('Nenhum link Pixeldrain encontrado para esse jogo.');
    return;
  }

  const escolhidoLink = linksPixeldrain[Math.floor(Math.random() * linksPixeldrain.length)];
  const idPixeldrain = escolhidoLink.split('/').pop();

  const pasta = path.join(__dirname, 'download');
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

  const safeTitle = jogo.title.replace(/[\/\\?%*:|"<>]/g, '').replace(/\s+/g, '_');
  const nomeArquivo = path.join(pasta, `${safeTitle}__${idPixeldrain}.bin`);

  try {
    console.log(`Iniciando download: ${jogo.title}`);
    await baixarArquivo(`https://pixeldrain.com/api/file/${idPixeldrain}`, nomeArquivo, jogo.title);
    console.log('Download concluído!');
  } catch (err) {
    console.error('Erro no download:', err.message);
  }
}

module.exports = { processarFlags };