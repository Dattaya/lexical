/* eslint-disable header/header */
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import * as React from 'react';

import PlaygroundNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

export type EditorComposerProps = {
  children: React.ComponentProps<typeof LexicalComposer>['children'];
} & Partial<
  Pick<React.ComponentProps<typeof LexicalComposer>, 'initialConfig'>
>;

export default function EditorComposer({
  children,
  initialConfig,
}: EditorComposerProps): JSX.Element {
  const config = {
    editorState: undefined,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
    ...initialConfig,
  };
  return <LexicalComposer initialConfig={config}>{children}</LexicalComposer>;
}
