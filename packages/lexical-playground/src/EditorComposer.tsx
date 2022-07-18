/* eslint-disable header/header */
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import * as React from 'react';

import PlaygroundNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

export type EditorComposerProps = {
  children: React.ComponentProps<typeof LexicalComposer>['children'];
  initialConfig?: Partial<
    React.ComponentProps<typeof LexicalComposer>['initialConfig']
  >;
};

export default function EditorComposer({
  children,
  initialConfig,
}: EditorComposerProps): JSX.Element {
  const config = {
    editorState: undefined,
    namespace: 'Playground',
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
    ...initialConfig,
    nodes: [...PlaygroundNodes, ...(initialConfig?.nodes ?? [])],
  };
  return <LexicalComposer initialConfig={config}>{children}</LexicalComposer>;
}
