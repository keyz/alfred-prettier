const alfyTest = require('alfy-test');

function formatOutput(input, output, flowStrippedOutput) {
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
      subtitle: `Flow stripped & Prettified "${input}"`,
      text: {
        copy: flowStrippedOutput,
        largetype: flowStrippedOutput,
      },
      title: flowStrippedOutput,
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
    ),
  );
});

test('it reports errors', async () => {
  const input = `const foo`;

  const alfy = alfyTest();
  const result = await alfy(input);

  const errorString = [
    'SyntaxError: unknown: Unexpected token (1:9)',
    '',
    '> 1 | const foo',
    '    |          ^',
  ].join('\n');

  expect(result).toHaveLength(1);
  expect(result[0].title).toBe(errorString);
});
