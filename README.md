# gamefetch-cli

>**Nota:**  
> Esta aplicação agrega conteúdos de fontes externas de terceiros e **filtra apenas os links hospedados no [pixeldrain](https://pixeldrain.com/)**, devido ao seu endpoint simples que permite download direto.

Versão com interface gráfica (GUI):  
[github.com/aglairvta/gamefetch](https://github.com/aglairvta/gamefetch)

---

## Qual a estrutura do JSON?

```json
{
  "name": "nome-da-fonte",
  "downloads": [
    {
      "title": "nome-do-jogo",
      "uris": [
        "magnet-ou-link-direto"
      ],
      "uploadDate": "data-upload",
      "fileSize": "tamanho-arquivo"
    }
  ]
}
```

---

## Instalação

**Pré-requisitos:**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

**Para instalar via terminal:**

```bash
curl -sL https://raw.githubusercontent.com/aglairvta/gamefetch-cli/main/install.sh | bash
```

Após a instalação, **reinicie seu terminal** para garantir que o comando `gamefetch` esteja disponível globalmente.

---

## Comandos e Flags

- `gamefetch-cli` → Inicia a aplicação
- `gamefetch-cli -h` → Exibe o manual de uso (help)
- `gamefetch-cli -l` → Lista todos os jogos disponíveis