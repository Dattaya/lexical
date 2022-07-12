/* eslint-disable header/header */
import type {LexicalEditor} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import useLayoutEffect from 'shared/useLayoutEffect';
import {useDebounce} from 'use-debounce';

const useSyncWithInputJson = (
  json?: Parameters<LexicalEditor['parseEditorState']>[0] | null,
) => {
  const [editor] = useLexicalComposerContext();
  const [debJson] = useDebounce(json, 800);
  const normJson = editor.getEditorState().isEmpty() ? json : debJson;

  useLayoutEffect(() => {
    if (normJson) {
      const currState = editor.getEditorState();
      if (normJson !== JSON.stringify(currState)) {
        const newState = editor.parseEditorState(normJson);
        editor.setEditorState(newState);
      }
    }
  }, [normJson]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSyncWithInputJson;
