/* eslint-disable header/header */
import './index.css';

import Editor from './Editor';
import EditorComposer from './EditorComposer';
import useSyncWithInputHtml from './hooks/useSyncWithInputHtml';
import useSyncWithInputJson from './hooks/useSyncWithInputJson';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

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
