# Gerza AI PR Analyzer

**Gerza AI PR Analyzer** es una GitHub Action que utiliza OpenAI para analizar los cambios en Pull Requests y generar un resumen detallado, archivo por archivo, en español o inglés.

### 🚀 ¿Qué hace esta Action?

- Detecta automáticamente los cambios realizados en un PR.
- Analiza cada archivo modificado y explica con nivel técnico qué está cambiando.
- Publica un comentario en el Pull Request con el análisis, usando GPT-4.
- Soporta idioma **español** o **inglés**.

---

## 🛠️ Cómo usarla

### 1. Agregar la Action a tu workflow

```yaml
- name: Análisis IA detallado de cambios
  uses: matiasgherza/ai-pr-analyzer@v1
  with:
    openai-api-key: ${{ secrets.OPENAI_APIKEY }}
    language: "spanish" # o "english"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
