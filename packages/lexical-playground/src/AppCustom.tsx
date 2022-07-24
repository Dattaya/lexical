/* eslint-disable header/header */
import * as React from 'react';

import {Editor, EditorComposer, EditorProps} from './index';

const toolbarConfig: EditorProps['toolbarConfig'] = {
  textColorPicker: false,
  bgColorPicker: false,
  fontFamilyOptions: [
    ['Roboto', 'Roboto'],
    ['Open Sans', 'Open Sans'],
  ],
};

function App(): JSX.Element {
  return <Editor toolbarConfig={toolbarConfig} isRichText />;
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <EditorComposer>
      <App />
    </EditorComposer>
  );
}
