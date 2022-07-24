/* eslint-disable header/header */
import {ExcalidrawNode} from '../nodes/ExcalidrawNode';
import ExcalidrawPlugin from '../plugins/ExcalidrawPlugin';
import ExcalidrawDropDownItem from '../plugins/ToolbarPluginItems/ExcalidrawDropDownItem';

export {ExcalidrawPlugin, ExcalidrawNode};

import type {Extension} from './extTypes';

export const excalidrawExt: Extension = {
  plugin: ExcalidrawPlugin,
  node: ExcalidrawNode,
  toolbarInsertAfter: ExcalidrawDropDownItem,
};
