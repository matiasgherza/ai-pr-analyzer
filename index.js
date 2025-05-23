const core = require('@actions/core');
const github = require('@actions/github');
const { Configuration, OpenAIApi } = require('openai');

async function run() {
  try {
    const apiKey = core.getInput('openai-api-key');
    const language = core.getInput('language').toLowerCase();

    if (!['spanish', 'english'].includes(language)) {
      throw new Error("El idioma debe ser 'english' o 'spanish'.");
    }

    const config = new Configuration({ apiKey });
    const openai = new OpenAIApi(config);

    const context = github.context;
    const pr = context.payload.pull_request;

    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const files = await octokit.rest.pulls.listFiles({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pr.number,
    });

    const changes = files.data
      .map(file => `Archivo: ${file.filename}\n${file.patch || '(sin diff visible)'}\n`)
      .join('\n');

    const prompt = language === 'spanish'
      ? `Analiza detalladamente los siguientes cambios en un Pull Request. Explica qué se está modificando archivo por archivo con el mayor nivel técnico posible, incluyendo qué cambios introduce el código:\n\n${changes}`
      : `Analyze in detail the following changes in a Pull Request. Explain what is being modified file by file, with the highest possible technical detail, including what the new code is introducing:\n\n${changes}`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = response.data.choices[0].message.content;

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body: `🧠 **Análisis IA (${language})**\n\n${summary}`,
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
