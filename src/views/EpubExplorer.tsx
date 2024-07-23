import { FC, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { JSZipObject } from "jszip";
import AlertSnackbar, { AlertSnackbarProps } from "../components/AlertSnackbar";
import Epub from "../components/Epub";
import EpubEditor from "../components/EpubEditor";
import EpubService from "../components/EpubService";
import FileUploader from "../components/FileUploader";
import EpubContentsList from "../components/EpubContentsList";

const EPUB_SUFFIX = "_generated_modified.epub";

/**
 * Simple application for seeing all the .xhtml files inside the ebook's OEBPS directory.
 * @returns
 */
const EpubExplorer: FC = () => {
  const { watch, reset, getValues } = useForm();
  const [epub, setEpub] = useState<Epub>();
  const [epubFile, setEpubFile] = useState<File>();
  const watchFile = watch("epubFile", "");
  const [currentFile, setCurrentFile] = useState<JSZipObject>();
  const [parserError, setParserError] = useState<string>();
  const [alertProps, setAlertProps] = useState<AlertSnackbarProps>({
    open: false,
    alertMessage: undefined,
    alertTitle: undefined,
    severity: "info",
    onCloseAlert: () => {},
  });
  useEffect(() => {}, []);

  const onSubmitHandler = async (data: any) => {
    if (data.epubFile.length === 0) {
      addMessage("Select a valid epub file", "Error", "error");
      return;
    }
    const file = data.epubFile[0];
    EpubService.openEpubFromBuffer(
      file,
      (e: Epub) => {
        setEpubFile(file);
        setEpub(e);
      },
      async (message: string) => {
        addMessage(message);
      },
    );
    //
  };

  const selectCallback = (file: JSZipObject) => {
    setCurrentFile(file);
  };

  const addMessage = useCallback(
    async (
      message: string,
      alertTitle?: string,
      severity?: string | "info",
    ) => {
      const myProps: AlertSnackbarProps = { ...alertProps };
      myProps.alertTitle = alertTitle;
      myProps.severity = severity;
      myProps.alertMessage = message;
      myProps.open = true; //setAlertContent(message);
      setAlertProps(myProps);
    },
    [setAlertProps, alertProps],
  );

  const saveChanges = useCallback(
    async (text: string) => {
      //create the xml file...
      const parser = new DOMParser();

      const xmlDoc = parser.parseFromString(text, "text/xml");
      //sanity check to look for parsing error
      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        const children: HTMLCollectionOf<Element> = errorNode.children;
        const textNode = children.item(1);

        setParserError(textNode?.innerHTML);
        addMessage(textNode?.innerHTML!, "Invalid xml", "error");
      }

      //throw new Error("Error parsing XML");
      else {
        await EpubService.replaceFile(
          epub!,
          currentFile!.name,
          xmlDoc,
          addMessage,
        );
        await addMessage(
          `Successfully replaced the file contents of ${currentFile!.name}.`,
          "success",
          "success",
        );
      }
    },
    [currentFile, epub, addMessage],
  );

  const generateEpub = useCallback(() => {
    const newName = epubFile!.name.replace(".epub", "");
    EpubService.generateEpub(
      epub!,
      newName + EPUB_SUFFIX,
      async (message: string) => {
        await addMessage(message);
      },
      //console.debug("Generated epub status:\t" + message);
      //here's where we need an alert
    );
  }, [addMessage, epubFile, epub]);

  const hasError = () => {
    if (parserError || parserError != null) {
      return true;
    }
    return false;
  };

  const handleClose = (e: any) => {
    setParserError(undefined);
  };

  const getAlert = useCallback(() => {
    const handleClose = () => {
      setAlertProps({ ...alertProps, open: false });
    };
    const myProps = { ...alertProps };
    myProps.onCloseAlert = handleClose;
    return <AlertSnackbar {...myProps} />;
  }, [alertProps, setAlertProps]);

  const resetForms = useCallback(() => {
    setCurrentFile(undefined);
    setEpub(undefined);
    setEpubFile(undefined);
    setParserError(undefined);
    reset();
  }, [setCurrentFile, setEpub, setEpubFile, setParserError, reset]);

  /**
   * Select an epub.
   * Rename also/about (will require changing manifests and toc
   *
   */
  return (
    <>
      {" "}
      <Grid rowSpacing={5} container direction={"row"}>
        <Grid item direction={"row"}>
          <Box display={"flex"}>
            <FileUploader
              fieldName="epubFile"
              getValues={getValues}
              submitHandler={onSubmitHandler}
              title={"Select Epub"}
              resetParent={resetForms}
            />
            {watchFile && watchFile.length === 1 && (
              <>
                <Button type="submit" value="Explore">
                  Explore
                </Button>
                <Button type="reset" onClick={() => resetForms()}>
                  Reset
                </Button>
              </>
            )}
          </Box>
        </Grid>
        <Grid item container direction={"row"}>
          {epub && epubFile && (
            <Grid item xs={3}>
              {/*<EpubFiles epub={epub} selectCallback={selectCallback} />*/}
              <EpubContentsList
                selectCallback={selectCallback}
                sourceZip={epub.sourceZip}
              />
            </Grid>
          )}
          {epub && currentFile && (
            <Grid item xs={6}>
              <EpubEditor
                epub={epub}
                file={currentFile}
                saveChanges={saveChanges}
                generateEpub={generateEpub}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      {getAlert()}
      <Dialog open={hasError()} onClose={handleClose}>
        <DialogTitle>Error while parsing file</DialogTitle>
        <DialogContent>
          <DialogContentText>{parserError}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e: any) => handleClose(e)}>Dismiss</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default EpubExplorer;