'use strict';

const alfy = require('alfy');
const babelCore = require('@babel/core');
const prettier = require('prettier');

let userPrettierConfig;
try {
  userPrettierConfig = JSON.parse(process.env.prettierConfig);
} catch (e) {
  userPrettierConfig = {};
}

const prettierConfig = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  parser: 'babel-flow',
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  ...userPrettierConfig
};

function getBabelConfig(plugins) {
  return {
    plugins,
    envName: 'production',
    generatorOpts: {
      comments: true,
      compact: false,
      retainFunctionParens: true,
      retainLines: true,
    },
    inputSourceMap: false,
    parserOpts: {
      plugins: [
        ['flow', {all: true}],
        'jsx',
        'asyncGenerators',
        'bigInt',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        ['decorators', {decoratorsBeforeExport: false}],
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'importMeta',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        ['pipelineOperator', {proposal: 'minimal'}],
        'throwExpressions',
      ],
    },
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
