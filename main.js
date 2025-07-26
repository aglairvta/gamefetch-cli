#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const { execSync } = require('child_process');

const { VERSAO, REPOSITORIO, FONTES } = require('./config');
const ui = require('./ui');
const { baixarArquivo } = require('./download');
const { processarFlags } = require('./flags');

const reset = '\x1b[0m';
const amarelo = '\x1b[33m';
const verde = '\x1b[32m';

async function buscarVersaoRemota() {
  const url = 'https://raw.githubusercontent.com/aglairvta/gamefetch-cli/main/package.json';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao buscar versão remota');
    const pkg = await res.json();
    return pkg.version;
  } catch {
    return null;
  }
}

function perguntarSimNao(pergunta) {
  const resposta = readlineSync.question(pergunta + ' ');
  return resposta.trim().toLowerCase();
}

async function carregarJogos() {
  let todos = [];

  for (const url of FONTES) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      let jogosArray = [];
      if (Array.isArray(data)) {
        jogosArray = data;
      } else {
        for (const key in data) {
          if (Array.isArray(data[key])) {
            jogosArray = data[key];
            break;
          }
        }
      }
      todos = todos.concat(jogosArray);
    } catch (e) {
      console.error(`Erro na fonte ${url}: ${e.message}`);
    }
  }

  return todos.filter(j => j.uris?.some(link => link.includes('pixeldrain')));
}

(async () => {
  const versaoRemota = await buscarVersaoRemota();
  if (versaoRemota && versaoRemota !== VERSAO) {
    const resposta = perguntarSimNao(`${amarelo}[!] Atualização disponível (${versaoRemota}). Deseja atualizar? (s/n)${reset}`);
    if (resposta === 's' || resposta === 'sim') {
      console.log(`${verde}Atualizando...${reset}`);
      try {
        execSync('curl -sL https://raw.githubusercontent.com/aglairvta/gamefetch-cli/main/install.sh | bash', { stdio: 'inherit' });
        console.log(`${verde}Atualização concluída! Reinicie o programa.${reset}`);
        process.exit(0);
      } catch (err) {
        console.error(`Erro ao atualizar: ${err.message}`);
        process.exit(1);
      }
    }
  }

  const jogos = await carregarJogos();
  const args = process.argv.slice(2);

  if (args.length > 0) {
    processarFlags(args[0], jogos, ui, baixarArquivo);
    return;
  }

  ui.apresentar(jogos.length, VERSAO, REPOSITORIO);
  const busca = ui.perguntarBusca();
  if (!busca.trim()) return;

  let opcoes = jogos.filter(j => j.title?.toLowerCase().includes(busca.toLowerCase()));
  opcoes.sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0));
  opcoes = opcoes.slice(0, 20);

  if (opcoes.length === 0) {
    console.log('Nenhuma opção encontrada para essa busca.');
    return;
  }

  ui.listarJogos(opcoes);

  const escolha = ui.perguntarEscolha(opcoes.length);
  if (escolha === 0) return;
  if (escolha < 1 || escolha > opcoes.length) {
    console.log('Opção inválida!');
    return;
  }

  const escolhido = opcoes[escolha - 1];

  console.log(`\n${verde}Título selecionado:${reset} ${escolhido.title}`);
  console.log(`${amarelo}Iniciando download de:${reset} ${escolhido.title}\n`);

  const linksPixeldrain = escolhido.uris.filter(link => link.includes('pixeldrain'));
  const escolhidoLink = linksPixeldrain[Math.floor(Math.random() * linksPixeldrain.length)];
  const idPixeldrain = escolhidoLink.split('/').pop();

  const pasta = path.join(__dirname, 'download');
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

  const safeTitle = escolhido.title.replace(/[\/\\?%*:|"<>]/g, '').replace(/\s+/g, '_');
  const nomeArquivo = path.join(pasta, `${safeTitle}__${idPixeldrain}.bin`);

  try {
    await baixarArquivo(`https://pixeldrain.com/api/file/${idPixeldrain}`, nomeArquivo, escolhido.title);
    const caminhoAmigavel = path.join('~', 'gamefetch-cli', 'download');
    console.log(`\n${verde}Download concluído!${reset}`);
    console.log(`${amarelo}Salvo em:${reset} ${caminhoAmigavel}`);
  } catch (err) {
    console.error('Erro no download:', err.message);
  }
})();