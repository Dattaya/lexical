/* eslint-disable header/header */
import type {
  ExtensionNode,
  ExtensionPlugin,
  ExtensionToolbarInsertAfter,
  ExtensionTransformer,
} from './ext/extTypes';

import {createContext as createReactContext, useContext} from 'react';
import invariant from 'shared/invariant';

export type Extensions = {
  nodes: Array<ExtensionNode>;
  plugins: Array<[string, ExtensionPlugin]>;
  transformers: Array<ExtensionTransformer>;
  toolbarInsertsAfter: Array<[string, ExtensionToolbarInsertAfter]>;
};

export type EditorComposerContextType = {
  extensions: Extensions;
};

export const EditorComposerContext =
  createReactContext<EditorComposerContextType | null>(null);

export function useEditorComposerContext(): EditorComposerContextType {
  const editorContext = useContext(EditorComposerContext);

  if (editorContext == null) {
    invariant(false, 'Cannot find an EditorComposerContext');
  }

  return editorContext;
}
