import React, { FC } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../App.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface DraftJSEditorProps {
  editorState: EditorState;
  editorStateChange: (stateChange: EditorState) => void;
  fileName: string;
}

const DraftJSEditor: FC<DraftJSEditorProps> = ({
  editorState,
  editorStateChange,
  fileName,
}) => {
  return (
    <>
      <div>
        <header>{`File from zip: ${fileName}`}</header>
        <Editor
          wrapperClassName="wrapper-class"
          editorState={editorState}
          onEditorStateChange={editorStateChange}
          toolbarHidden={true}
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
        />
      </div>
    </>
  );
};
export default DraftJSEditor;
