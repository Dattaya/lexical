/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {ToolbarConfig} from './plugins/toolbarTypes';
import type {EditorState, LexicalEditor} from 'lexical';

import {$generateHtmlFromNodes} from '@lexical/html';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {AutoScrollPlugin} from '@lexical/react/LexicalAutoScrollPlugin';
import {CharacterLimitPlugin} from '@lexical/react/LexicalCharacterLimitPlugin';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import {CollaborationPlugin} from '@lexical/react/LexicalCollaborationPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import * as React from 'react';
import {useMemo, useRef, useState} from 'react';

import {createWebsocketProvider} from './collaboration';
import {useSharedHistoryContext} from './context/SharedHistoryContext';
import {useEditorComposerContext} from './EditorComposerContext';
import ActionsPlugin from './plugins/ActionsPlugin';
import AutocompletePlugin from './plugins/AutocompletePlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
// import CommentPlugin from './plugins/CommentPlugin';
// import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import HorizontalRulePlugin from './plugins/HorizontalRulePlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import {MaxLengthPlugin} from './plugins/MaxLengthPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import PollPlugin from './plugins/PollPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin';
import ToolbarPlugin, {ToolbarPluginProps} from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

const skipCollaborationInit =
  // @ts-ignore
  window.parent != null && window.parent.frames.right === window;

export type EditorProps = {
  isCollab?: boolean;
  isAutocomplete?: boolean;
  isMaxLength?: boolean;
  isCharLimit?: boolean;
  isCharLimitUtf8?: boolean;
  isRichText?: boolean;
  showTreeView?: boolean;
  showTableOfContents?: boolean;
  onChange?: (
    htmlJson: string,
    editorState: EditorState,
    editor: LexicalEditor,
  ) => void;
  onChangeMode?: 'html' | 'json';
  toolbarConfig?: ToolbarConfig;
} & Pick<ToolbarPluginProps, 'onUpload'>;

const defaultToolbarConfig: ToolbarConfig = {
  align: true,
  bgColorPicker: true,
  biu: true,
  codeBlock: true,
  fontFamilyOptions: true,
  fontSizeOptions: true,
  formatBlockOptions: true,
  formatTextOptions: true,
  insertOptions: true,
  link: true,
  textColorPicker: true,
  undoRedo: true,
};

export default function Editor({
  isCollab,
  isAutocomplete,
  isMaxLength,
  isCharLimit,
  isCharLimitUtf8,
  isRichText = false,
  showTreeView,
  showTableOfContents,
  onChange,
  onChangeMode = 'json',
  onUpload,
  toolbarConfig,
}: EditorProps): JSX.Element {
  const {historyState} = useSharedHistoryContext();
  const text = isCollab
    ? 'Enter some collaborative rich text...'
    : isRichText
    ? 'Enter some rich text...'
    : 'Enter some plain text...';
  const placeholder = <Placeholder>{text}</Placeholder>;
  const scrollRef = useRef(null);

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const editorContext = useEditorComposerContext();

  const normToolbarConfig = useMemo(
    () => ({...defaultToolbarConfig, ...toolbarConfig}),
    [toolbarConfig],
  );

  return (
    <div className="editor-shell">
      {isRichText && (
        <ToolbarPlugin config={normToolbarConfig} onUpload={onUpload} />
      )}
      <div
        className={`editor-container ${showTreeView ? 'tree-view' : ''} ${
          !isRichText ? 'plain-text' : ''
        }`}
        ref={scrollRef}>
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        {/* <ComponentPickerPlugin /> */}
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />
        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        <AutoScrollPlugin scrollRef={scrollRef} />
        {onChange && (
          <OnChangePlugin
            onChange={(editorState, editor) => {
              if (onChangeMode === 'html') {
                editor.update(() => {
                  onChange(
                    $generateHtmlFromNodes(editor, null),
                    editorState,
                    editor,
                  );
                });
              } else if (onChangeMode === 'json') {
                onChange(JSON.stringify(editorState), editorState, editor);
              }
            }}
          />
        )}
        {isRichText ? (
          <>
            {isCollab ? (
              <CollaborationPlugin
                id="main"
                providerFactory={createWebsocketProvider}
                shouldBootstrap={!skipCollaborationInit}
              />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin />
            <TableCellResizer />
            <ImagesPlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            <ClickableLinkPlugin />
            <HorizontalRulePlugin />
            <TabFocusPlugin />
            <CollapsiblePlugin />
            {floatingAnchorElem && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                  config={normToolbarConfig}
                />
              </>
            )}
            {editorContext.extensions.plugins.map(([extName, Plugin]) => (
              <Plugin key={extName} />
            ))}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin charset={isCharLimit ? 'UTF-16' : 'UTF-8'} />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        <ActionsPlugin isRichText={isRichText} />
      </div>
      {showTreeView && <TreeViewPlugin />}
    </div>
  );
}
