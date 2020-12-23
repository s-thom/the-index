// Adapted from https://github.com/contiamo/restful-react/blob/master/examples/restful-react.config.js

// eslint-disable-next-line import/no-extraneous-dependencies
const { camel } = require('case');

/**
 * @type {import('restful-react/dist/bin/restful-react-import').AdvancedOptions['customGenerator']}
 */
function generate({ componentName, verb, route, description, genericsTypes, paramsInPath, paramsTypes }) {
  const propsType = (type) => `Custom${type}Props<${genericsTypes}>${paramsInPath.length ? ` & {${paramsTypes}}` : ''}`;

  const propsParameter = paramsInPath.length ? `{${paramsInPath.join(', ')}, ...props}` : 'props';

  if (verb === 'get') {
    return `

${description}export function ${camel(componentName)} (
  ${propsParameter}: ${propsType('Get')}
) {
  return customGet<${genericsTypes}>(\`${route}\`, props);
}

`;
  }

  return `

${description}export function ${camel(componentName)} (
  ${propsParameter}: ${propsType('Mutate')}
) {
  return customMutate<${genericsTypes}>("${verb.toUpperCase()}", \`${route}\`, props);
}

`;
}

/**
 * @type {import("restful-react/dist/bin/config").RestfulReactAdvancedConfiguration}
 */
module.exports = {
  'custom-generator': {
    file: '../openapi/build/the-index.yaml',
    output: 'src/api-types.ts',
    skipReact: true,
    customImport: `import { customGet, customMutate, CustomGetProps, CustomMutateProps } from "./util/fetchers"`,
    customGenerator: generate,
  },
};
