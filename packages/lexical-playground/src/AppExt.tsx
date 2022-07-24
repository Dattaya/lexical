/* eslint-disable header/header */
import * as React from 'react';

import {excalidrawExt} from './ext/excalidraw';
import {Editor, EditorComposer} from './index';

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
