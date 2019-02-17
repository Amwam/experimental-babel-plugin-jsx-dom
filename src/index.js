const jsx = require('@babel/plugin-syntax-jsx').default;
const helper = require('@babel/helper-builder-react-jsx').default;
module.exports = function({ types: t, parse }) {
  const document = t.identifier('document');
  const createElement = t.identifier('createElement');
  const setAttribute = t.identifier('setAttribute');
  const createTextNode = t.identifier('createTextNode');
  const appendChild = t.identifier('append');

  function createAST(jsxElement, t) {
    const tagName = jsxElement.openingElement.name.name;
    let element = t.callExpression(
      t.memberExpression(document, createElement),
      [t.stringLiteral(tagName)],
    );

    if (jsxElement.openingElement.attributes) {
      jsxElement.openingElement.attributes.forEach(attribute => {
        element = createAttribute(attribute, t, element);
      });
    }

    if (jsxElement.children) {
      jsxElement.children.forEach(child => {
        let content;
        if (child.type === 'JSXElement') {
          content = createAST(child, t);
          element = t.callExpression(t.memberExpression(element, appendChild), [
            content,
          ]);
        } else {
          // TODO: Fix this
          // content = t.stringLiteral(child.value);
          // element = t.assignmentExpression(
          //   '=',
          //   t.memberExpression(element, t.stringLiteral('innerText')),
          //   content,
          // );
        }
      });
    }

    return element;
  }

  function createAttribute(jsxAttribute, t, element) {
    const attrName = jsxAttribute.name.name;
    const value = jsxAttribute.value.value;
    return t.callExpression(t.memberExpression(element, setAttribute), [
      t.stringLiteral(jsxAttribute.name.name),
      t.stringLiteral(jsxAttribute.value.value),
    ]);
  }

  function children(children, t, element) {}

  return {
    visitor: {
      JSXElement(path) {
        path.replaceWith(createAST(path.node, t));
      },
    },
  };
};
