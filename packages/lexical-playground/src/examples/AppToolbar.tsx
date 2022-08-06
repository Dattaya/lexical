/* eslint-disable header/header */
import * as React from 'react';

import {Editor, EditorComposer, EditorProps} from '../index';

const toolbarConfig: EditorProps['toolbarConfig'] = {
  bgColorPicker: false,
  fontFamilyOptions: [
    ['Roboto', 'Roboto'],
    ['Open Sans', 'Open Sans'],
  ],
  textColorPicker: false,
};

function App(): JSX.Element {
  return <Editor toolbarConfig={toolbarConfig} isRichText={true} />;
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <EditorComposer>
      <App />
    </EditorComposer>
  );
}
