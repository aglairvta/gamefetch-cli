#!/bin/bash
set -e

VERDE="\033[0;32m"
AMARELO="\033[0;33m"
VERMELHO="\033[0;31m"
RESET="\033[0m"

REPO_URL="https://github.com/aglairvta/gamefetch-cli.git"
INSTALL_DIR="$HOME/gamefetch-cli"
BIN_LINK="/usr/local/bin/gamefetch-cli"

echo -e "${VERDE}Iniciando instalação do gamefetch-cli...${RESET}"

if ! command -v node &> /dev/null
then
    echo -e "${VERMELHO}Node.js não encontrado. Por favor, instale o Node.js antes de continuar.${RESET}"
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo -e "${VERMELHO}npm não encontrado. Por favor, instale o npm antes de continuar.${RESET}"
    exit 1
fi

if [ -d "$INSTALL_DIR" ]; then
    echo -e "${AMARELO}Repositório já existe em $INSTALL_DIR, atualizando...${RESET}"
    cd "$INSTALL_DIR"
    git pull origin main
else
    echo -e "${AMARELO}Clonando repositório em $INSTALL_DIR...${RESET}"
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

echo -e "${AMARELO}Instalando dependências...${RESET}"
cd "$INSTALL_DIR"
npm install --production

chmod +x "$INSTALL_DIR/main.js"

echo -e "${AMARELO}Criando link simbólico em $BIN_LINK...${RESET}"

if [ -w "/usr/local/bin" ]; then
    ln -sf "$INSTALL_DIR/main.js" "$BIN_LINK"
else
    echo -e "${VERMELHO}Permissão insuficiente para criar link em /usr/local/bin.${RESET}"
    echo -e "${AMARELO}Tentando criar link simbólico no ~/.local/bin/ (pasta do usuário)...${RESET}"
    mkdir -p "$HOME/.local/bin"
    ln -sf "$INSTALL_DIR/main.js" "$HOME/.local/bin/gamefetch-cli"
    echo -e "${AMARELO}Adicione ~/.local/bin ao seu PATH se ainda não estiver configurado:${RESET}"
    echo -e "  ${VERDE}export PATH=\$HOME/.local/bin:\$PATH${RESET}"
    echo -e "${VERDE}Depois disso, você poderá usar o comando 'gamefetch-cli'.${RESET}"
    exit 0
fi

echo -e "${VERDE}Instalação concluída com sucesso!${RESET}"
echo -e "${VERDE}Você pode executar o comando 'gamefetch-cli' para rodar a aplicação.${RESET}"