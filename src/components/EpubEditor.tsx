import { Button, Grid } from "@mui/material";
import { JSZipObject } from "jszip";
import { FC, useCallback, useEffect, useState } from "react";
import "../App.css";
import DraftJSEditor from "./DraftJSEditor";
import Epub from "./Epub";
import { EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";

interface EpubEditorProps {
  epub: Epub;
  file: JSZipObject;
  saveChanges: Function;
  generateEpub: Function;
}
const EpubEditor: FC<EpubEditorProps> = ({
  epub,
  file,
  saveChanges,
  generateEpub,
}) => {
  const [dirty, setDirty] = useState<boolean>();
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty(),
  );
  const setTextFromFile = useCallback(() => {
    const p = epub?.sourceZip?.file(file.name)?.async("string");
    if (p) {
      p.then((e) => {
        const contentState = ContentState.createFromText(e);
        setEditorState(EditorState.createWithContent(contentState));
        setDirty(false);
      });
    }
  }, [epub, file, setDirty]);

  useEffect(() => {
    setTextFromFile();
  }, [file, setTextFromFile]);

  useEffect(() => {
    //@ts-ignore
    if (editorState.isEmpty) {
      setTextFromFile();
    }
  }, [setTextFromFile, editorState]);

  const onEditorStateChange = (change: EditorState) => {
    setDirty(true);
    setEditorState(change);
  };

  const handleSave = (e: any) => {
    console.debug("calling save!");
    saveChanges(editorState.getCurrentContent().getPlainText());
    setDirty(false);
  };

  const handleGenerate = (e: any) => {
    generateEpub();
  };

  return (
    <>
      <Grid container>
        <Grid item>
          <DraftJSEditor
            fileName={file.name}
            editorState={editorState}
            editorStateChange={onEditorStateChange}
          />
        </Grid>
        <Grid item>
          {dirty && (
            <>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button onClick={(e) => setTextFromFile()}>Revert</Button>
            </>
          )}
          {!dirty && <Button onClick={handleGenerate}>Generate Epub</Button>}
        </Grid>
      </Grid>
    </>
  );
};
export default EpubEditor;
