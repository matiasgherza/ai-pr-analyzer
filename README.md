# Gerza AI PR Analyzer

**Gerza AI PR Analyzer** es una GitHub Action que usa la API de OpenAI para analizar Pull Requests y generar un resumen detallado, archivo por archivo, en español o inglés.

---

## 🚀 ¿Qué hace?

- Detecta automáticamente los archivos modificados en un Pull Request.
- Genera un análisis detallado de cada archivo, explicando los cambios.
- Comenta automáticamente el resumen generado por IA en el PR.
- Usa el modelo GPT-4 para un análisis técnico y preciso.

---

## 🧩 Cómo usar

1. **Agregar el secret con tu API Key de OpenAI**  
   - `OPENAI_APIKEY`: Clave que empieza con `sk-...`.

2. **Ejemplo de uso en tu workflow**

```yaml
- name: Ejecutar Gerza AI PR Analyzer
  uses: matiasgherza/gerza-ai-pr-analyzer@v1
  with:
    openai-api-key: ${{ secrets.OPENAI_APIKEY }}
    language: "spanish" # o "english"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
