import { TextField, Button } from "@mui/material";
import "../App.css";
import { FC, useCallback, useEffect } from "react";
import { JSZipObject } from "jszip";

interface FileReplacerProps {
  currentFile: JSZipObject;
  submitter: Function;
  setFileName: Function;
  newFileName: string | undefined;
}

const FileReplacer: FC<FileReplacerProps> = ({
  currentFile,
  submitter,
  setFileName,
  newFileName,
}) => {
  const onSubmitHandler = useCallback(async () => {
    await submitter();
  }, [submitter]);

  useEffect(() => {}, [currentFile]);

  return (
    <>
      <TextField
        style={{ width: "80%" }}
        label={"Enter new name for " + currentFile.name.split("OEBPS/")[1]}
        onChange={(e) => setFileName(e.target.value)}
        value={newFileName}
        helperText={"File must end in '.xhtml'"}
      />
      <Button title={"Rename File"} onClick={onSubmitHandler}>
        Rename File
      </Button>
    </>
  );
  //there should only be a single field we need which is the new name...
};
export default FileReplacer;
