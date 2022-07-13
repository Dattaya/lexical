/* eslint-disable header/header */
import type {LexicalEditor} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import useLayoutEffect from 'shared/useLayoutEffect';
import {useDebounce} from 'use-debounce';

type JsonState = Parameters<LexicalEditor['parseEditorState']>[0] | null;

const stringifyJsonState = (json?: JsonState): string | undefined | null => {
  if (json && typeof json !== 'string') {
    return JSON.stringify(json);
  }
  return json;
};

const useSyncWithInputJson = (json?: JsonState) => {
  const [editor] = useLexicalComposerContext();
  const [debJson] = useDebounce(json, 800);
  const normJson = editor.getEditorState().isEmpty() ? json : debJson;

  useLayoutEffect(() => {
    if (normJson) {
      const currState = editor.getEditorState();
      if (stringifyJsonState(normJson) !== JSON.stringify(currState)) {
        const newState = editor.parseEditorState(normJson);
        editor.setEditorState(newState);
      }
    }
  }, [normJson]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSyncWithInputJson;
