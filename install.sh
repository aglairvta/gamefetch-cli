#!/bin/bash
set -e

VERDE="\033[0;32m"
AMARELO="\033[0;33m"
RESET="\033[0m"

REPO_URL="https://github.com/aglairvta/gamefetch-cli.git"
INSTALL_DIR="$HOME/gamefetch-cli"
LOCAL_BIN="$HOME/.local/bin"
BIN_LINK="$LOCAL_BIN/gamefetch-cli"

echo -e "${VERDE}Iniciando instalação do gamefetch-cli...${RESET}"

if ! command -v node &> /dev/null; then
    echo -e "${VERMELHO}Node.js não encontrado. Por favor, instale o Node.js antes de continuar.${RESET}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
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
npm install --omit=dev

chmod +x "$INSTALL_DIR/main.js"

mkdir -p "$LOCAL_BIN"
ln -sf "$INSTALL_DIR/main.js" "$BIN_LINK"

SHELL_NAME=$(basename "$SHELL")
PROFILE_FILE=""

if [ "$SHELL_NAME" = "bash" ]; then
    PROFILE_FILE="$HOME/.bashrc"
elif [ "$SHELL_NAME" = "zsh" ]; then
    PROFILE_FILE="$HOME/.zshrc"
else
    PROFILE_FILE="$HOME/.profile"
fi

if ! grep -q 'export PATH=$HOME/.local/bin:$PATH' "$PROFILE_FILE"; then
    echo -e "\n# Adicionado pelo instalador gamefetch-cli" >> "$PROFILE_FILE"
    echo 'export PATH=$HOME/.local/bin:$PATH' >> "$PROFILE_FILE"
fi

echo -e "${AMARELO}Criando link simbólico em $BIN_LINK${RESET}"
echo -e "${AMARELO}PATH atualizado em $PROFILE_FILE${RESET}"
echo -e "${VERDE}Reinicie seu terminal ou rode: source $PROFILE_FILE${RESET}"
echo -e "${VERDE}Agora você pode usar o comando 'gamefetch-cli'.${RESET}"