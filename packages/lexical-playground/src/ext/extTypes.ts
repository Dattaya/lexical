import type {FC} from 'react';
import type {LexicalNode, LexicalEditor, Klass} from 'lexical';
import type {Transformer} from '@lexical/markdown';

import type useModal from '../hooks/useModal';

export type ToolbarItemProps = {
  showModal: ReturnType<typeof useModal>[1];
  activeEditor: LexicalEditor;
};

export type ExtensionNode = Klass<LexicalNode>;
export type ExtensionPlugin = () => JSX.Element | null;
export type ExtensionTransformer = Transformer;
export type ExtensionToolbarInsertAfter = FC<ToolbarItemProps>;

export type Extension = {
  node?: ExtensionNode;
  plugin?: ExtensionPlugin;
  transformer?: ExtensionTransformer;
  toolbarInsertAfter?: ExtensionToolbarInsertAfter;
};
