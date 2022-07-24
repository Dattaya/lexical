/* eslint-disable header/header */
import type {Extensions} from './EditorComposerContext';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import * as React from 'react';
import {useMemo} from 'react';

import PlaygroundNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import type {Extension} from './ext/extTypes';
import {EditorComposerContext} from './EditorComposerContext';

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
          if (extension.plugin) acc.plugins.push(extension.plugin);
          if (extension.transformer)
            acc.transformers.push(extension.transformer);
          if (extension.toolbarInsertAfter)
            acc.toolbarInsertsAfter.push(extension.toolbarInsertAfter);
          return acc;
        },
        {
          nodes: [],
          plugins: [],
          transformers: [],
          toolbarInsertsAfter: [],
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
