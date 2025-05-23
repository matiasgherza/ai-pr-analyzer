# Gerza AI PR Analyzer

**Gerza AI PR Analyzer** es una GitHub Action que utiliza OpenAI para analizar Pull Requests y generar un resumen detallado, archivo por archivo, explicando qué se modifica y qué se introduce nuevo, en **español** o **inglés**.

---

## 🚀 ¿Qué hace esta Action?

- Detecta automáticamente los archivos modificados en un Pull Request.
- Usa GPT-4 para generar un análisis detallado de los cambios por archivo.
- Publica un comentario automático en el PR con el resumen generado por IA.
- Soporta idioma `spanish` o `english`.

---

## 🧩 Cómo usarla

### 1. Agregá el secret `OPENAI_APIKEY`

En el repositorio donde vas a usar esta acción (por ejemplo, SmartChef):

- Ir a **Settings > Secrets > Actions**
- Crear un nuevo secreto:
  - **Name**: `OPENAI_APIKEY`
  - **Value**: tu clave de API de OpenAI (empieza con `sk-...`)

---

### 2. Crear el archivo de workflow

📄 `.github/workflows/gerza-ai-pr-analyzer.yml`

```yaml
name: Gerza AI PR Analyzer

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - name: Ejecutar Gerza AI PR Analyzer
        uses: matiasgherza/gerza-ai-pr-analyzer@v1
        with:
          openai-api-key: ${{ secrets.OPENAI_APIKEY }}
          language: "spanish"  # o "english"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
