/* eslint-disable header/header */
import type {Extensions} from './EditorComposerContext';
import type {Extension} from './ext/extTypes';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import * as React from 'react';
import {useMemo} from 'react';

import {EditorComposerContext} from './EditorComposerContext';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

export type EditorComposerProps = {
  children: React.ComponentProps<typeof LexicalComposer>['children'];
  initialConfig?: Partial<
    React.ComponentProps<typeof LexicalComposer>['initialConfig']
  >;
  extensions?: Array<Extension>;
};

export default function EditorComposer({
  children,
  initialConfig,
  extensions,
}: EditorComposerProps): JSX.Element {
  const editorContextValue = useMemo(
    () => ({
      extensions: (extensions ?? []).reduce(
        (acc, extension) => {
          if (extension.node) acc.nodes.push(extension.node);
          if (extension.plugin)
            acc.plugins.push([extension.name, extension.plugin]);
          if (extension.transformer)
            acc.transformers.push(extension.transformer);
          if (extension.toolbarInsertAfter)
            acc.toolbarInsertsAfter.push([
              extension.name,
              extension.toolbarInsertAfter,
            ]);
          return acc;
        },
        {
          nodes: [],
          plugins: [],
          toolbarInsertsAfter: [],
          transformers: [],
        } as Extensions,
      ),
    }),
    [extensions],
  );

  const config = {
    editorState: undefined,
    namespace: 'Playground',
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
    ...initialConfig,
    nodes: [
      ...PlaygroundNodes,
      ...(initialConfig?.nodes ?? []),
      ...editorContextValue.extensions.nodes,
    ],
  };
  return (
    <EditorComposerContext.Provider value={editorContextValue}>
      <LexicalComposer initialConfig={config}>{children}</LexicalComposer>
    </EditorComposerContext.Provider>
  );
}
