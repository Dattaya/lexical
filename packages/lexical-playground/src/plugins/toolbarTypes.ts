/* eslint-disable header/header */
type SelectOptions = [string, string][];

export type ToolbarConfig = {
  undoRedo?: boolean;
  formatBlockOptions?: boolean;
  fontFamilyOptions?: boolean | SelectOptions;
  fontSizeOptions?: boolean;
  biu?: boolean;
  codeBlock?: boolean;
  link?: boolean;
  textColorPicker?: boolean;
  bgColorPicker?: boolean;
  formatTextOptions?: boolean;
  insertOptions?: boolean;
  align?: boolean;
};
