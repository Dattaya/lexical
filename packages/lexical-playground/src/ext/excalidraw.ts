/* eslint-disable header/header */
import type {Extension} from './extTypes';

import {ExcalidrawNode} from '../nodes/ExcalidrawNode';
import ExcalidrawPlugin from '../plugins/ExcalidrawPlugin';
import ExcalidrawDropDownItem from '../plugins/ToolbarPlugin/ExcalidrawDropDownItem';

export * from '../nodes/ExcalidrawNode';
export {ExcalidrawPlugin};

export const excalidrawExt: Extension = {
  name: 'excalidraw',
  node: ExcalidrawNode,
  plugin: ExcalidrawPlugin,
  toolbarInsertAfter: ExcalidrawDropDownItem,
};
