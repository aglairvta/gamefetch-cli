#!/bin/bash
set -e

VERDE="\033[0;32m"
AMARELO="\033[0;33m"
VERMELHO="\033[0;31m"
RESET="\033[0m"

REPO_URL="https://github.com/aglairvta/gamefetch-cli.git"
INSTALL_DIR="$HOME/gamefetch-cli"
BIN_LINK="/usr/local/bin/gamefetch-cli"
LOCAL_BIN="$HOME/.local/bin"
LOCAL_LINK="$LOCAL_BIN/gamefetch-cli"

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
npm install --production
chmod +x main.js

echo -e "${AMARELO}Criando link simbólico...${RESET}"
if [ -w "/usr/local/bin" ]; then
    ln -sf "$INSTALL_DIR/main.js" "$BIN_LINK"
    echo -e "${VERDE}Link criado em /usr/local/bin/gamefetch-cli${RESET}"
else
    echo -e "${VERMELHO}Sem permissão para escrever em /usr/local/bin.${RESET}"
    echo -e "${AMARELO}Usando fallback: ~/.local/bin/gamefetch-cli${RESET}"
    mkdir -p "$LOCAL_BIN"
    ln -sf "$INSTALL_DIR/main.js" "$LOCAL_LINK"

    CURRENT_SHELL=$(basename "$SHELL")
    case "$CURRENT_SHELL" in
        bash) SHELL_CONFIG="$HOME/.bashrc" ;;
        zsh)  SHELL_CONFIG="$HOME/.zshrc" ;;
        fish)
            echo -e "${VERMELHO}Fish shell não suportado automaticamente. Adicione ~/.local/bin manualmente ao PATH.${RESET}"
            exit 0
            ;;
        *) SHELL_CONFIG="$HOME/.profile" ;;
    esac

    if ! grep -q 'export PATH=\$HOME/.local/bin:\$PATH' "$SHELL_CONFIG"; then
        echo -e "${AMARELO}Adicionando ~/.local/bin ao PATH em $SHELL_CONFIG...${RESET}"
        echo '# Adicionado pelo instalador do gamefetch-cli' >> "$SHELL_CONFIG"
        echo 'export PATH=$HOME/.local/bin:$PATH' >> "$SHELL_CONFIG"
    else
        echo -e "${AMARELO}PATH já configurado em $SHELL_CONFIG.${RESET}"
    fi

    echo -e "${VERDE}gamefetch-cli instalado com sucesso no ~/.local/bin!${RESET}"
    echo -e "${AMARELO}Reinicie seu terminal ou rode:${RESET} source $SHELL_CONFIG"
    exit 0
fi

echo -e "${VERDE}Instalação concluída com sucesso!${RESET}"
echo -e "${VERDE}Você pode agora rodar:${RESET} gamefetch-cli"