/* eslint-disable header/header */
import type {Extension} from './extTypes';

import {EquationNode} from '../nodes/EquationNode';
import EquationsPlugin from '../plugins/EquationsPlugin';
import EquationDropDownItem from '../plugins/ToolbarPluginItems/EquationDropDownItem';
import {EQUATION} from '../plugins/Transformers/equationTransformer';

export * from '../nodes/EquationNode';
export * from '../plugins/EquationsPlugin';

export const equationExt: Extension = {
  name: 'equation',
  node: EquationNode,
  plugin: EquationsPlugin,
  toolbarInsertAfter: EquationDropDownItem,
  transformer: EQUATION,
};
