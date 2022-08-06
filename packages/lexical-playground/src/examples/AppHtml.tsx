/* eslint-disable header/header */
import * as React from 'react';
import {useState} from 'react';

import {Editor, EditorComposer, useSyncWithInputHtml} from '../index';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const uploadImg = async (file: File, altText: string) => {
  await delay(500);
  return `https://placehold.co/300x300?text=${altText}`;
};

function App({
  html,
  setHtml,
}: {
  html: string;
  setHtml: (newHtml: string) => void;
}): JSX.Element {
  useSyncWithInputHtml(html);

  return (
    <Editor
      isRichText={true}
      onChange={setHtml}
      onUpload={uploadImg}
      onChangeMode="html"
    />
  );
}

export default function PlaygroundApp1(): JSX.Element {
  const [html, setHtml] = useState('<b>test</b>');
  return (
    <>
      <EditorComposer>
        <App html={html} setHtml={setHtml} />
      </EditorComposer>
      <div dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
}
