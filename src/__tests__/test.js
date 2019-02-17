const babel = require('@babel/core');
const plugin = require('../');

function check(codeExample) {
  const { code } = babel.transform(codeExample, {
    plugins: ['@babel/plugin-syntax-jsx', plugin],
  });

  expect(code).toMatchSnapshot();
}

test('Empty element', () => {
  check('<div />');
});

test('No children', () => {
  check('<div></div>');
});

test('Attributes', () => {
  check('<div attribute="test" attribute2="test2" />');
});

test.skip('Text child', () => {
  check('<div>Hello, world!</div>');
});

test.skip('Text child, with attribute', () => {
  check('<div attribute="testing">Hello, world!</div>');
});

test.skip('JSX children', () => {
  check('<div><span>Hello, world!</span></div>');
});
