const alfy = require('alfy');
const babelCore = require('@babel/core');
const prettier = require('prettier');

const prettierConfig = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  parser: 'babel',
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
};

function getBabelConfig(plugins) {
  return {
    envName: 'production',
    generatorOpts: {
      comments: true,
      compact: false,
      retainFunctionParens: true,
      retainLines: true,
    },
    inputSourceMap: false,
    plugins,
  };
}

function main() {
  const input = alfy.input;
  let flowStrippedRaw = '';
  let flowCommentedRaw = '';

  let prettierOutput = '';

  try {
    prettierOutput = prettier.format(input, prettierConfig);
  } catch (prettierError) {
    alfy.error(String(prettierError));
    return;
  }

  try {
    flowStrippedRaw = babelCore.transform(
      prettierOutput,
      getBabelConfig(['@babel/plugin-transform-flow-strip-types']),
    ).code;
  } catch (babelError) {
    alfy.error(String(babelError));
    return;
  }

  try {
    // Run Babel over the Prettier output, such that comments will look nicer
    flowCommentedRaw = babelCore.transform(
      prettierOutput,
      getBabelConfig(['@babel/plugin-transform-flow-comments']),
    ).code;
  } catch (babelError) {
    alfy.error(String(babelError));
    return;
  }

  let prettierFlowStrippedOutput = '';
  let prettierFlowCommentedOutput = '';

  try {
    // Run Prettier again over the Babel output
    prettierFlowStrippedOutput = prettier.format(
      flowStrippedRaw,
      prettierConfig,
    );
    prettierFlowCommentedOutput = prettier.format(
      flowCommentedRaw,
      prettierConfig,
    );
  } catch (prettierError) {
    alfy.error(String(prettierError));
    return;
  }

  alfy.output([
    {
      arg: prettierOutput,
      subtitle: `Prettified "${input}"`,
      text: {
        copy: prettierOutput,
        largetype: prettierOutput,
      },
      title: prettierOutput,
    },
    {
      arg: prettierFlowStrippedOutput,
      icon: {
        path: 'flow-logo.png',
      },
      subtitle: `Flow stripped & prettified "${input}"`,
      text: {
        copy: prettierFlowStrippedOutput,
        largetype: prettierFlowStrippedOutput,
      },
      title: prettierFlowStrippedOutput,
    },
    {
      arg: prettierFlowCommentedOutput,
      icon: {
        path: 'flow-logo.png',
      },
      subtitle: `Flow commented & prettified "${input}"`,
      text: {
        copy: prettierFlowCommentedOutput,
        largetype: prettierFlowCommentedOutput,
      },
      title: prettierFlowCommentedOutput,
    },
  ]);
}

main();
