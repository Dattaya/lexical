/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import * as React from 'react';

import {useEditorComposerContext} from '../../EditorComposerContext';
import {PLAYGROUND_TRANSFORMERS} from '../MarkdownTransformers';

export default function MarkdownPlugin(): JSX.Element {
  const editorContext = useEditorComposerContext();
  return (
    <MarkdownShortcutPlugin
      transformers={[
        ...PLAYGROUND_TRANSFORMERS,
        ...editorContext.extensions.transformers,
      ]}
    />
  );
}
