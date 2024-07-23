import { Button, Grid } from "@mui/material";
import { JSZipObject } from "jszip";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import "../App.css";
import Epub from "./Epub";

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
  const [text, setText] = useState<string>();
  const [dirty, setDirty] = useState<boolean>();
  const setTextFromFile = useCallback(() => {
    const p = epub?.sourceZip?.file(file.name)?.async("string");
    if (p) {
      p.then((e) => {
        setText(e);
        setDirty(false);
      });
    }
  }, [epub, setText, setDirty, file]);

  useEffect(() => {
    setTextFromFile();
  }, [file, setTextFromFile]);

  useEffect(() => {
    if (!text) {
      setTextFromFile();
    }
  }, [setTextFromFile, text]);

  const onChangeText = (e: ChangeEvent) => {
    //@ts-ignore
    setText(e.target.value);
    setDirty(true);
  };

  const handleSave = (e: any) => {
    console.debug("calling save!");
    saveChanges(text);
    setDirty(false);
  };

  const handleGenerate = (e: any) => {
    generateEpub();
  };

  return (
    <>
      <Grid container>
        <Grid item>{"File from zip:\t" + file.name}</Grid>
        <Grid item>
          <textarea value={text} cols={75} rows={25} onChange={onChangeText} />
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
