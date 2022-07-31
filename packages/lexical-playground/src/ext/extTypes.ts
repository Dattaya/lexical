/* eslint-disable header/header */
import type useModal from '../hooks/useModal';
import type {Transformer} from '@lexical/markdown';
import type {Klass, LexicalEditor, LexicalNode} from 'lexical';
import type {FC} from 'react';

export type ToolbarItemProps = {
  showModal: ReturnType<typeof useModal>[1];
  activeEditor: LexicalEditor;
};

export type ExtensionNode = Klass<LexicalNode>;
export type ExtensionPlugin = () => JSX.Element | null;
export type ExtensionTransformer = Transformer;
export type ExtensionToolbarInsertAfter = FC<ToolbarItemProps>;

export type Extension = {
  name: string;
  node?: ExtensionNode;
  plugin?: ExtensionPlugin;
  transformer?: ExtensionTransformer;
  toolbarInsertAfter?: ExtensionToolbarInsertAfter;
};
