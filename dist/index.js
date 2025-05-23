/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 518:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 90:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 935:
/***/ ((module) => {

module.exports = eval("require")("openai");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(518);
const github = __nccwpck_require__(90);
const { Configuration, OpenAIApi } = __nccwpck_require__(935);

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

module.exports = __webpack_exports__;
/******/ })()
;
