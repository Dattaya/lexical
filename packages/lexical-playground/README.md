# `lexical-playground`

A temporary packaged fork of Lexical's official playground until someone creates something better.

## Usage
### HTML as input/output

```tsx
import { Editor, EditorComposer, useSyncWithInputHtml } from '@ohs/lexical-playground';
import '@ohs/lexical-playground/theme.css'; // or import your own theme styles
import '@ohs/lexical-playground/editor.css';

function MyEditor({ html, setHtml }: {
  html: string;
  setHtml: (newHtml: string) => void;
}): JSX.Element {
  useSyncWithInputHtml(html);

  return (
    <Editor isRichText onChange={setHtml} onUpload={uploadImg} onChangeMode="html" />
  );
}

export default function PlaygroundApp(): JSX.Element {
  const [html, setHtml] = useState('<b>test</b>');
  return (
    <EditorComposer>
      <MyEditor html={html} setHtml={setHtml} />
    </EditorComposer>
  );
}
```

### A JSON string as input/output

```tsx
import { Editor, EditorComposer, useSyncWithInputJson } from '@ohs/lexical-playground';
import '@ohs/lexical-playground/theme.css'; // or import your own theme styles
import '@ohs/lexical-playground/editor.css';

function MyEditor({ json, setJson }: {
  json: string;
  setJson: (html: string) => void;
}): JSX.Element {
  useSyncWithInputJson(json); // either a string or an object

  return <Editor isRichText onChange={setJson} onChangeMode="json" />;
}

export default function PlaygroundApp(): JSX.Element {
  const [json, setJson] = useState(
    '{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"test","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
  );
  return (
    <EditorComposer>
      <MyEditor json={json} setJson={setJson} />
    </EditorComposer>
  );
}
```

### Customizing the toolbar
Certain buttons can be ommited from the toolbar, and some can be configured if necessary:
```tsx
import { Editor, EditorComposer, EditorProps } from '@ohs/lexical-playground';

const toolbarConfig: EditorProps['toolbarConfig'] = {
  textColorPicker: false,
  bgColorPicker: false,
  fontFamilyOptions: [
    ['Roboto', 'Roboto'],
    ['Open Sans', 'Open Sans'],
  ],
};

function MyEditor(): JSX.Element {
  return <Editor toolbarConfig={toolbarConfig} isRichText />;
};

export default function PlaygroundApp(): JSX.Element {
  return (
    <EditorComposer>
      <MyEditor />
    </EditorComposer>
  );
}

```
### Theme overriding
It's recommended to replace built-in class names with your own:

```tsx
import { Editor, EditorComposer, EditorThemeClasses } from '@ohs/lexical-playground';
import '@ohs/lexical-playground/editor.css';
import './myTheme.css';

const theme: EditorThemeClasses = {
  characterLimit: 'MyTheme__characterLimit',
  code: 'MyTheme__code',
  // ...
};

function MyEditor(): JSX.Element {
  return <Editor isRichText />;
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <EditorComposer initialConfig={{ theme }}>
      <MyEditor />
    </EditorComposer>
  );
}
```
### Uploading an image and returning a path
By default images are converted to data URLs.
```tsx
  // ...
  const uploadImg = async (file: File, altText: string) => {
    // process the file
    return urlOfImage;
  }
  return (
    <Editor 
      onUpload={uploadImg}  
      isRichText
      // ...
    />
  );
```

### Getting an access to the lexical editor's instance
```tsx
function MyEditor(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  return (
    <Editor isRichText={true} />
  );
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <EditorComposer>
      <MyEditor />
    </EditorComposer>
  );
}
```

### Showing exported HTML w/o loading the entire editor
The only thing that's needed to display HTML that lexical generated is to import `theme.css`.

```tsx
import '@ohs/lexical-playground/theme.css'; // or import your own theme styles

export default function PlaygroundApp({ html }: { html: string }): JSX.Element {
  return (
    <div dangerouslySetInnerHTML={{__html: html}} />
  );
}
```

### SSR
At this point the editor does not support SSR and needs to be loaded on the client.
#### Next.js
```tsx
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const MyEditor = dynamic(() => import('./path-to-my-editor-that-loads-lexical-playground'), {
  ssr: false,
})

const MyPage: NextPage = () => {
  return (
    <MyEditor />
  )
}

export default MyPage
```

### Using optional plugins
Some plugins like `excalidraw` are optional, and need to be manually activated:

```tsx
// ...
import {excalidrawExt} from '@ohs/lexical-playground/ext/excalidraw';
import '@ohs/lexical-playground/ext/excalidraw.css';

function MyEditor(): JSX.Element {
  return (
    <Editor isRichText={true} />
  );
}

const extensions = [excalidrawExt];

export default function PlaygroundApp(): JSX.Element {
  return (
    <EditorComposer extensions={extensions}>
      <App />
    </EditorComposer>
  );
}
```
