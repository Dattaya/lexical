/* eslint-disable header/header */
import './index.css';

import Editor from './Editor';
import EditorComposer from './EditorComposer';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import useSyncWithInputHtml from './useSyncWithInputHtml';
import useSyncWithInputJson from './useSyncWithInputJson';

export {SharedAutocompleteContext} from './context/SharedAutocompleteContext';
export {SharedHistoryContext} from './context/SharedHistoryContext';
export * from './Editor';
export * from '@lexical/html';
export * from '@lexical/react/LexicalComposer';
export * from '@lexical/react/LexicalComposerContext';
export * from 'lexical';

export {
  Editor,
  EditorComposer,
  PasteLogPlugin,
  PlaygroundEditorTheme,
  PlaygroundNodes,
  TestRecorderPlugin,
  TypingPerfPlugin,
  useSyncWithInputHtml,
  useSyncWithInputJson,
};
