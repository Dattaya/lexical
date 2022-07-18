/* eslint-disable header/header */
import * as React from 'react';

import {Editor, EditorComposer} from './index';
import {ExcalidrawNode, ExcalidrawPlugin} from './ext/excalidraw';

function App(): JSX.Element {
  return (
    <>
      <ExcalidrawPlugin />
      <Editor isRichText={true} />
    </>
  );
}

export default function PlaygroundApp4(): JSX.Element {
  return (
    <EditorComposer initialConfig={{nodes: [ExcalidrawNode]}}>
      <App />
    </EditorComposer>
  );
}
