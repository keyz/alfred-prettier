const alfyTest = require('alfy-test');

test('it works', async () => {
  const input = `const foo: {[key: string]:number} = {james:12,lucy: 24,ming:235};`;

  const alfy = alfyTest();
  const result = await alfy(input);

  expect(result).toEqual([
    {
      arg:
        'const foo: {[key: string]: number} = {james: 12, lucy: 24, ming: 235};\n',
      subtitle:
        'Prettified "const foo: {[key: string]:number} = {james:12,lucy: 24,ming:235};"',
      text: {
        copy:
          'const foo: {[key: string]: number} = {james: 12, lucy: 24, ming: 235};\n',
        largetype:
          'const foo: {[key: string]: number} = {james: 12, lucy: 24, ming: 235};\n',
      },
      title:
        'const foo: {[key: string]: number} = {james: 12, lucy: 24, ming: 235};\n',
    },
    {
      arg: 'const foo = {james: 12, lucy: 24, ming: 235};\n',
      icon: {
        path: 'flow-logo.png',
      },
      subtitle:
        'Flow stripped & Prettified "const foo: {[key: string]:number} = {james:12,lucy: 24,ming:235};"',
      text: {
        copy: 'const foo = {james: 12, lucy: 24, ming: 235};\n',
        largetype: 'const foo = {james: 12, lucy: 24, ming: 235};\n',
      },
      title: 'const foo = {james: 12, lucy: 24, ming: 235};\n',
    },
  ]);
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
