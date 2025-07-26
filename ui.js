const readline = require('readline-sync');

function apresentar(totalJogos, VERSAO, REPOSITORIO) {
  console.clear();
  const verde = '\x1b[32m';
  const amarelo = '\x1b[33m';
  const reset = '\x1b[0m';

  console.log(`${verde}
+-----------------------------------------+
 _____               ___     _       _   
|   __|___ _____ ___|  _|___| |_ ___| |_ 
|  |  | .'|     | -_|  _| -_|  _|  _|   |
|_____|__,|_|_|_|___|_| |___|_| |___|_|_|

+-----------------------------------------+
${reset}`);

console.log(`${verde}◆ Versão: ${amarelo}${VERSAO}${reset}`);
console.log(`${verde}◆ Repositório: ${amarelo}${REPOSITORIO}${reset}`);
console.log(`${verde}◆ Jogos disponíveis: ${amarelo}${totalJogos}${reset}`);
console.log('────────────────────────────────────────────\n');
}

function perguntarBusca() {
  const resposta = readline.question('Digite o nome do jogo: ').toLowerCase();
  console.log();
  return resposta;
}

function truncar(texto, maxLen) {
  if (!texto) return '';
  return texto.length > maxLen ? texto.slice(0, maxLen - 3) + '...' : texto;
}

function listarJogos(opcoes) {
  const idxWidth = 4;       
  const tituloWidth = 65;
  const tamanhoWidth = 10;
  const dataWidth = 10;

  const reset = '\x1b[0m';
  const negrito = '\x1b[1m';
  const corIndice = '\x1b[36m';   // ciano
  const corTitulo = '\x1b[32m';   // verde
  const corTamanho = '\x1b[33m';  // amarelo
  const corData = '\x1b[34m';     // azul

  console.log(
    negrito +
    '#'.padEnd(idxWidth) +
    'Título'.padEnd(tituloWidth) + ' | ' +
    'Tamanho'.padEnd(tamanhoWidth) + ' | ' +
    'Data'.padEnd(dataWidth) +
    reset
  );
  console.log('-'.repeat(idxWidth + tituloWidth + 3 + tamanhoWidth + 3 + dataWidth));

  opcoes.forEach((jogo, i) => {
    const idxText = String(i + 1).padStart(idxWidth - 2, ' ') + ') ';
    const idx = corIndice + idxText + reset;

    const tituloRaw = truncar(jogo.title || 'Sem título', tituloWidth).padEnd(tituloWidth, ' ');
    const titulo = corTitulo + tituloRaw + reset;

    const tamanhoRaw = (typeof jogo.fileSize === 'string' && jogo.fileSize.trim() !== '')
      ? jogo.fileSize.padEnd(tamanhoWidth, ' ')
      : '???'.padEnd(tamanhoWidth, ' ');
    const tamanho = corTamanho + tamanhoRaw + reset;

    const dataRaw = jogo.uploadDate
      ? new Date(jogo.uploadDate).toLocaleDateString('pt-BR').padEnd(dataWidth, ' ')
      : '??/??/??'.padEnd(dataWidth, ' ');
    const data = corData + dataRaw + reset;

    console.log(`${idx}${titulo} | ${tamanho} | ${data}`);
  });

  console.log();
}

function perguntarEscolha(qtd) {
  const resposta = readline.question('\nDigite o número da opção que deseja baixar (0 para sair): ');
  const numero = parseInt(resposta, 10);
  if (isNaN(numero) || numero < 0 || numero > qtd) return 0;
  return numero;
}

module.exports = {
  apresentar,
  perguntarBusca,
  listarJogos,
  perguntarEscolha,
};