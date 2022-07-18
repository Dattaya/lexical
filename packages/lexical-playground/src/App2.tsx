/* eslint-disable header/header */
import * as React from 'react';
import {useState} from 'react';

import {Editor, EditorComposer, useSyncWithInputJson} from './index';

function App({
  json,
  setJson,
}: {
  json: string;
  setJson: (html: string) => void;
}): JSX.Element {
  useSyncWithInputJson(json);

  return <Editor isRichText={true} onChange={setJson} onChangeMode="json" />;
}

export default function PlaygroundApp2(): JSX.Element {
  const [json, setJson] = useState(
    '{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"test","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
  );
  return (
    <>
      <EditorComposer>
        <App json={json} setJson={setJson} />
      </EditorComposer>
      <div dangerouslySetInnerHTML={{__html: json}} />
    </>
  );
}
