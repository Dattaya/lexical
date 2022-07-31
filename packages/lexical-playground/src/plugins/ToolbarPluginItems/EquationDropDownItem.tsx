/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {ToolbarItemProps} from '../../ext/extTypes';
import type {LexicalEditor} from 'lexical';

import * as React from 'react';
import {useCallback} from 'react';

import {DropDownItem} from '../../ui/DropDown';
import KatexEquationAlterer from '../../ui/KatexEquationAlterer';
import {INSERT_EQUATION_COMMAND} from '../EquationsPlugin';

export function InsertEquationDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {equation, inline});
      onClose();
    },
    [activeEditor, onClose],
  );

  return <KatexEquationAlterer onConfirm={onEquationConfirm} />;
}

export default function EquationDropDownItem({
  activeEditor,
  showModal,
}: ToolbarItemProps): JSX.Element {
  return (
    <DropDownItem
      onClick={() => {
        showModal('Insert Equation', (onClose) => (
          <InsertEquationDialog activeEditor={activeEditor} onClose={onClose} />
        ));
      }}
      className="item">
      <i className="icon equation" />
      <span className="text">Equation</span>
    </DropDownItem>
  );
}
