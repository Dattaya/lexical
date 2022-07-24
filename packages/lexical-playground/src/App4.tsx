/* eslint-disable header/header */
import * as React from 'react';

import {Editor, EditorComposer} from './index';
import {excalidrawExt} from './ext/excalidraw';

function App(): JSX.Element {
  return <Editor isRichText={true} />;
}

const extensions = [excalidrawExt];

export default function PlaygroundApp4(): JSX.Element {
  return (
    <EditorComposer extensions={extensions}>
      <App />
    </EditorComposer>
  );
}
