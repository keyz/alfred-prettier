const alfyTest = require('alfy-test');

function formatOutput(input, output, flowStrippedOutput, flowCommentedOutput) {
  return [
    {
      arg: output,
      subtitle: `Prettified "${input}"`,
      text: {
        copy: output,
        largetype: output,
      },
      title: output,
    },
    {
      arg: flowStrippedOutput,
      icon: {
        path: 'flow-logo.png',
      },
      subtitle: `Flow stripped & prettified "${input}"`,
      text: {
        copy: flowStrippedOutput,
        largetype: flowStrippedOutput,
      },
      title: flowStrippedOutput,
    },
    {
      arg: flowCommentedOutput,
      icon: {
        path: 'flow-logo.png',
      },
      subtitle: `Flow commented & prettified "${input}"`,
      text: {
        copy: flowCommentedOutput,
        largetype: flowCommentedOutput,
      },
      title: flowCommentedOutput,
    },
  ];
}

test('it works', async () => {
  const input = `const foo: {[key: string]:number} = {james:12,lucy: 24,ming:235};`;

  const alfy = alfyTest();
  const result = await alfy(input);

  expect(result).toEqual(
    formatOutput(
      input,
      'const foo: {[key: string]: number} = {james: 12, lucy: 24, ming: 235};\n',
      'const foo = {james: 12, lucy: 24, ming: 235};\n',
      'const foo /*: {[key: string]: number}*/ = {james: 12, lucy: 24, ming: 235};\n',
    ),
  );
});

test('it reports errors', async () => {
  const input = `const foo`;

  const alfy = alfyTest();
  const result = await alfy(input);

  const errorString = [
    'SyntaxError: Unexpected token (1:10)',
    '> 1 | const foo',
    '    |          ^',
  ].join('\n');

  expect(result).toHaveLength(1);
  expect(result[0].title).toBe(errorString);
});

test('it errors on unstandardized language features', async () => {
  const input = `class Foo { property = 'initializer' }`;

  const alfy = alfyTest();
  const result = await alfy(input);

  const errorString = [
    "SyntaxError: unknown: Support for the experimental syntax 'classProperties' isn't currently enabled (2:12):",
    '',
    '  1 | class Foo {',
    "> 2 |   property = 'initializer';",
    '    |            ^',
    '  3 | }',
    '  4 | ',
    '',
    "Add @babel/plugin-proposal-class-properties (https://git.io/vb4SL) to the 'plugins' section of your Babel config to enable transformation.",
  ].join('\n');

  expect(result).toHaveLength(1);
  expect(result[0].title).toBe(errorString);
});
