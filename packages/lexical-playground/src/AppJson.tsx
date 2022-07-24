/* eslint-disable header/header */
import * as React from 'react';
import {useState} from 'react';

import {
  Editor,
  EditorComposer,
  EditorProps,
  SerializedEditorState,
  useSyncWithInputJson,
} from './index';

function App({
  json,
  setJson,
}: {
  json?: SerializedEditorState;
  setJson: (newJson: SerializedEditorState) => void;
}): JSX.Element {
  useSyncWithInputJson(json);

  const handleOnChange: EditorProps['onChange'] = (jsonString, editorState) => {
    setJson(editorState.toJSON());
  };

  return <Editor isRichText={true} onChange={handleOnChange} />;
}

export default function PlaygroundApp3(): JSX.Element {
  const [json, setJson] = useState<SerializedEditorState>({
    root: {
      children: [{type: 'paragraph', version: 1}],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
  return (
    <>
      <EditorComposer>
        <App json={json} setJson={setJson} />
      </EditorComposer>
      <div dangerouslySetInnerHTML={{__html: JSON.stringify(json)}} />
    </>
  );
}
