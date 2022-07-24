/* eslint-disable header/header */
import type {Extension} from './extTypes';

import {ExcalidrawNode} from '../nodes/ExcalidrawNode';
import ExcalidrawPlugin from '../plugins/ExcalidrawPlugin';
import ExcalidrawDropDownItem from '../plugins/ToolbarPluginItems/ExcalidrawDropDownItem';

export * from '../nodes/ExcalidrawNode';
export {ExcalidrawPlugin};

export const excalidrawExt: Extension = {
  node: ExcalidrawNode,
  plugin: ExcalidrawPlugin,
  toolbarInsertAfter: ExcalidrawDropDownItem,
};
