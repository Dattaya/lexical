/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const rollup = require('rollup');
const fs = require('fs-extra');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const babel = require('@rollup/plugin-babel').default;
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const extractErrorCodes = require('./error-codes/extract-errors');
const alias = require('@rollup/plugin-alias');
const {exec} = require('child-process-promise');
const {terser} = require('rollup-plugin-terser');
const postcss = require('rollup-plugin-postcss');
const postcssurl = require('postcss-url');

const license = ` * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.`;

const isProduction = argv.prod;
const isRelease = argv.release;
const isWWW = argv.www;
const extractCodes = argv.codes;

const wwwMappings = {
  '@lexical/clipboard': 'LexicalClipboard',
  '@lexical/code': 'LexicalCode',
  '@lexical/dragon': 'LexicalDragon',
  '@lexical/file': 'LexicalFile',
  '@lexical/hashtag': 'LexicalHashtag',
  '@lexical/headless': 'LexicalHeadless',
  '@lexical/history': 'LexicalHistory',
  '@lexical/html': 'LexicalHtml',
  '@lexical/link': 'LexicalLink',
  '@lexical/list': 'LexicalList',
  '@lexical/mark': 'LexicalMark',
  '@lexical/markdown': 'LexicalMarkdown',
  '@lexical/offset': 'LexicalOffset',
  '@lexical/overflow': 'LexicalOverflow',
  '@lexical/plain-text': 'LexicalPlainText',
  '@lexical/rich-text': 'LexicalRichText',
  '@lexical/selection': 'LexicalSelection',
  '@lexical/table': 'LexicalTable',
  '@lexical/text': 'LexicalText',
  '@lexical/utils': 'LexicalUtils',
  '@lexical/yjs': 'LexicalYjs',
  lexical: 'Lexical',
  'prismjs/components/prism-core': 'prismjs',
  'react-dom': 'ReactDOMComet',
};

const lexicalReactModules = fs
  .readdirSync(path.resolve('./packages/lexical-react/src'))
  .filter(
    (str) =>
      !str.includes('__tests__') &&
      !str.includes('shared') &&
      !str.includes('test-utils'),
  );

const lexicalPlaygroundExtensions = fs
  .readdirSync(path.resolve('./packages/lexical-playground/src/ext'))
  .filter((str) => !str.includes('extTypes'));

const lexicalReactModuleExternals = lexicalReactModules.map((module) => {
  const basename = path.basename(path.basename(module, '.ts'), '.tsx');
  const external = `@lexical/react/${basename}`;
  wwwMappings[external] = basename;
  return external;
});

const externals = [
  'lexical',
  'prismjs/components/prism-core',
  'prismjs/components/prism-clike',
  'prismjs/components/prism-javascript',
  'prismjs/components/prism-markup',
  'prismjs/components/prism-markdown',
  'prismjs/components/prism-c',
  'prismjs/components/prism-css',
  'prismjs/components/prism-objectivec',
  'prismjs/components/prism-sql',
  'prismjs/components/prism-python',
  'prismjs/components/prism-rust',
  'prismjs/components/prism-swift',
  '@lexical/list',
  '@lexical/table',
  '@lexical/file',
  '@lexical/clipboard',
  '@lexical/hashtag',
  '@lexical/headless',
  '@lexical/html',
  '@lexical/history',
  '@lexical/selection',
  '@lexical/text',
  '@lexical/offset',
  '@lexical/utils',
  '@lexical/code',
  '@lexical/yjs',
  '@lexical/plain-text',
  '@lexical/rich-text',
  '@lexical/mark',
  '@lexical/dragon',
  '@lexical/overflow',
  '@lexical/link',
  '@lexical/markdown',
  'react-dom',
  'react',
  'yjs',
  'y-websocket',
  '@excalidraw/excalidraw',
  'katex',
  'link-preview-generator',
  'lodash',
  'use-debounce',
  ...lexicalReactModuleExternals,
  ...Object.values(wwwMappings),
];

const errorCodeOpts = {
  errorMapFilePath: 'scripts/error-codes/codes.json',
};

const findAndRecordErrorCodes = extractErrorCodes(errorCodeOpts);

const strictWWWMappings = {};

// Add quotes around mappings to make them more strict.
Object.keys(wwwMappings).forEach((mapping) => {
  strictWWWMappings[`'${mapping}'`] = `'${wwwMappings[mapping]}'`;
});

async function build(name, inputFile, outputPath, outputFile, isProd) {
  const postCssOptions = {
    plugins: [
      postcssurl({
        fallback: 'copy',
        maxSize: 10,
        url: 'inline',
      }),
    ],
    to: path.join(outputPath, 'name.css'),
  };
  const inputOptions = {
    external(modulePath, src) {
      return externals.includes(modulePath);
    },
    input: inputFile,
    onwarn(warning) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        // Ignored
      } else if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
        // Important, but not enough to stop the build
        console.error();
        console.error(warning.message || warning);
        console.error();
      } else if (typeof warning.code === 'string') {
        console.error(warning);
        // This is a warning coming from Rollup itself.
        // These tend to be important (e.g. clashes in namespaced exports)
        // so we'll fail the build on any of them.
        console.error();
        console.error(warning.message || warning);
        console.error();
        process.exit(1);
      } else {
        // The warning is from one of the plugins.
        // Maybe it's not important, so just print it.
        console.warn(warning.message || warning);
      }
    },
    plugins: [
      alias({
        entries: [
          {find: 'shared', replacement: path.resolve('packages/shared/src')},
        ],
      }),
      // Extract error codes from invariant() messages into a file.
      {
        transform(source) {
          // eslint-disable-next-line no-unused-expressions
          extractCodes && findAndRecordErrorCodes(source);
          return source;
        },
      },
      ...(outputFile.includes('/ext/')
        ? [
            postcss({
              ...postCssOptions,
              extract: `${path.basename(inputFile)}.css`,
            }),
          ]
        : []),
      ...(outputFile.includes('LexicalPlayground')
        ? [
            postcss({
              ...postCssOptions,
              exclude: '**/themes/PlaygroundEditorTheme.css',
              extract: 'editor.css',
            }),
            postcss({
              ...postCssOptions,
              extract: 'theme.css',
              include: '**/themes/PlaygroundEditorTheme.css',
            }),
          ]
        : []),
      nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      babel({
        babelHelpers: 'bundled',
        babelrc: false,
        configFile: false,
        exclude: '/**/node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          [
            require('./error-codes/transform-error-messages'),
            {noMinify: !isProd},
          ],
        ],
        presets: [
          [
            '@babel/preset-typescript',
            {
              tsconfig: path.resolve('./tsconfig.build.json'),
            },
          ],
          '@babel/preset-react',
        ],
      }),
      {
        resolveId(importee, importer) {
          if (importee === 'formatProdErrorMessage') {
            return path.resolve(
              './scripts/error-codes/formatProdErrorMessage.js',
            );
          }
        },
      },
      commonjs(),
      replace(
        Object.assign(
          {
            __DEV__: isProd ? 'false' : 'true',
            delimiters: ['', ''],
            preventAssignment: true,
          },
          isWWW && strictWWWMappings,
        ),
      ),
      isProd && terser(),
      {
        renderChunk(source) {
          // Assets pipeline might use "export" word in the beginning of the line
          // as a dependency, avoiding it with empty comment in front
          const patchedSource = isWWW
            ? source.replace(/^(export(?!s))/gm, '/**/$1')
            : source;
          return `${getComment()}\n${patchedSource}`;
        },
      },
    ],
    // This ensures PrismJS imports get included in the bundle
    treeshake: isWWW || name !== 'Lexical Code' ? 'smallest' : undefined,
  };
  const outputOptions = {
    esModule: false,
    exports: 'auto',
    externalLiveBindings: false,
    file: outputFile,
    format: 'cjs', // change between es and cjs modules
    freeze: false,
    inlineDynamicImports: true,
    interop: false,
  };
  const result = await rollup.rollup(inputOptions);
  await result.write(outputOptions);
}

function getComment() {
  const lines = ['/**', license];
  if (isWWW) {
    lines.push(
      '*',
      '* @fullSyntaxTransform',
      '* @generated',
      '* @noflow',
      '* @nolint',
      '* @oncall lexical_web_text_editor',
      '* @preserve-invariant-messages',
      '* @preserve-whitespace',
      '* @preventMunge',
    );
  }
  lines.push(' */');
  return lines.join('\n');
}

function getFileName(fileName, isProd) {
  if (isWWW || isRelease) {
    return `${fileName}.${isProd ? 'prod' : 'dev'}.js`;
  }
  return `${fileName}.js`;
}

const packages = [
  {
    modules: [
      {
        outputFileName: 'LexicalPlayground',
        sourceFileName: 'index.tsx',
      },
      ...lexicalPlaygroundExtensions.map((module) => {
        const basename = path.basename(path.basename(module, '.ts'), '.tsx');
        return {
          name: basename,
          outputFileName: basename,
          sourceFileName: basename,
          subPath: '/ext',
        };
      }),
    ],
    name: 'Lexical Playground',
    outputPath: './packages/lexical-playground/dist/',
    packageName: 'lexical-playground',
    sourcePath: './packages/lexical-playground/src/',
  },
];

async function buildTSDeclarationFiles(packageName, outputPath) {
  await exec('tsc -p ./tsconfig.build.json');
}

async function moveTSDeclarationFilesIntoDist(packageName, outputPath) {
  await fs.copy(`./.ts-temp/${packageName}/src`, outputPath);
}

function buildForkModule(outputPath, outputFileName) {
  const lines = [
    getComment(),
    `'use strict'`,
    `const ${outputFileName} = process.env.NODE_ENV === 'development' ? require('./${outputFileName}.dev.js') : require('./${outputFileName}.prod.js')`,
    `module.exports = ${outputFileName};`,
  ];
  const fileContent = lines.join('\n');
  fs.outputFileSync(
    path.resolve(path.join(outputPath, `${outputFileName}.js`)),
    fileContent,
  );
}

async function buildAll() {
  if (!isWWW && (isRelease || isProduction)) {
    await buildTSDeclarationFiles();
  }

  for (const pkg of packages) {
    const {name, sourcePath, outputPath, packageName, modules} = pkg;

    for (const module of modules) {
      const {sourceFileName, outputFileName} = module;
      let inputFile = path.resolve(
        path.join(sourcePath, module.subPath ?? '', sourceFileName),
      );
      const normOutputPath = path.join(outputPath, module.subPath ?? '');
      await build(
        `${name}${module.name ? '-' + module.name : ''}`,
        inputFile,
        normOutputPath,
        path.resolve(
          path.join(normOutputPath, getFileName(outputFileName, isProduction)),
        ),
        isProduction,
      );

      if (isRelease) {
        await build(
          name,
          inputFile,
          normOutputPath,
          path.resolve(
            path.join(normOutputPath, getFileName(outputFileName, false)),
          ),
          false,
        );
        buildForkModule(normOutputPath, outputFileName);
      }
    }

    if (!isWWW && (isRelease || isProduction)) {
      await moveTSDeclarationFilesIntoDist(packageName, outputPath);
    }
  }
}

buildAll();
