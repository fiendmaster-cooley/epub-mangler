import { $getRoot, $getSelection } from "lexical";
import { useEffect, FC } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

interface LexicalEditorProps {}

const LexicalEditor: FC<LexicalEditorProps> = ({ ...props }) => {
  const theme = {
    // Theme styling goes here
    //...
  };
  const onError = (error: Error) => {
    console.error(error);
  };

  const initialConfig = {
    namespace: "XHTML Editor",
    theme,
    onError,
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}></LexicalComposer>
    </>
  );
};
export default LexicalEditor;
