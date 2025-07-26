const pkg = require('./package.json');

module.exports = {
  VERSAO: pkg.version,
  REPOSITORIO: pkg.repository.url,
  FONTES: [
    'https://raw.githubusercontent.com/Shisuiicaro/source/refs/heads/main/shisuyssource.json',
    'https://davidkazumi-github-io.pages.dev/fontekazumi.json'
  ]
};
