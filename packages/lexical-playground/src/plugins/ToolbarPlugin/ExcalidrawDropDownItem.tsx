/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {ToolbarItemProps} from '../../ext/extTypes';

import * as React from 'react';

import {DropDownItem} from '../../ui/DropDown';
import {INSERT_EXCALIDRAW_COMMAND} from '../ExcalidrawPlugin';

export default function ExcalidrawDropDownItem({
  activeEditor,
}: ToolbarItemProps): JSX.Element {
  return (
    <DropDownItem
      onClick={() => {
        activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
      }}
      className="item">
      <i className="icon diagram-2" />
      <span className="text">Excalidraw</span>
    </DropDownItem>
  );
}
