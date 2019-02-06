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

const babelConfig = {
  envName: 'production',
  generatorOpts: {
    comments: true,
    compact: false,
    retainFunctionParens: true,
    retainLines: true,
  },
  inputSourceMap: false,
  presets: ['@babel/preset-flow'],
};

function main() {
  const input = alfy.input;
  let flowStrippedRaw = '';

  try {
    flowStrippedRaw = babelCore.transform(input, babelConfig).code;
  } catch (babelError) {
    alfy.error(String(babelError));
    return;
  }

  let prettierOutput = '';
  let prettierFlowStrippedOutput = '';

  try {
    prettierOutput = prettier.format(input, prettierConfig);
    prettierFlowStrippedOutput = prettier.format(
      flowStrippedRaw,
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
      subtitle: `Flow stripped & Prettified "${input}"`,
      text: {
        copy: prettierFlowStrippedOutput,
        largetype: prettierFlowStrippedOutput,
      },
      title: prettierFlowStrippedOutput,
    },
  ]);
}

main();
