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
import Epub from "../components/Epub";
import EpubAlert from "../components/EpubAlert";
import EpubContentsList from "../components/EpubContentsList";
import EpubEditor from "../components/EpubEditor";
import EpubService from "../components/EpubService";
import FileUploader from "../components/FileUploader";
import AlertSnackbar from "../components/AlertSnackbar";

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
  const [currentAlert, setCurrentAlert] = useState<EpubAlert>();
  useEffect(() => {}, []);

  const onSubmitHandler = async (data: any) => {
    resetForms();
    if (data.epubFile.length === 0) {
      await addMessage({
        alertMessage: "Select a valid epub file",
        alertTitle: "Error",
        severity: "error",
      });
      return;
    }
    const file = data.epubFile[0];
    EpubService.openEpubFromBuffer(
      file,
      (e: Epub) => {
        setEpubFile(file);
        setEpub(e);
      },
      async (message: EpubAlert) => {
        await addMessage({
          alertMessage: message.alertMessage,
          alertTitle: message.alertTitle,
          severity: message.severity,
        });
      },
    );
    //
  };

  const selectCallback = (file: JSZipObject) => {
    setCurrentFile(file);
  };

  const addMessage = useCallback(
    async (alert: EpubAlert) => {
      setCurrentAlert(alert);
    },
    [setCurrentAlert],
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
        addMessage({
          alertMessage: textNode?.innerHTML!,
          alertTitle: "Invalid xml",
          severity: "error",
        });
      }

      //throw new Error("Error parsing XML");
      else {
        await EpubService.replaceFile(
          epub!,
          currentFile!.name,
          xmlDoc,
          addMessage,
        );
        await addMessage({
          alertMessage: `Successfully replaced the file contents of ${currentFile!.name}.`,
          alertTitle: "success",
          severity: "success",
        });
      }
    },
    [currentFile, epub, addMessage],
  );

  const generateEpub = useCallback(() => {
    const newName = epubFile!.name.replace(".epub", "");
    EpubService.generateEpub(
      epub!,
      newName + EPUB_SUFFIX,
      async (message: EpubAlert) => {
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

  const resetForms = useCallback(() => {
    setCurrentFile(undefined);
    setEpub(undefined);
    setEpubFile(undefined);
    setParserError(undefined);
    reset();
  }, [setCurrentFile, setEpub, setEpubFile, setParserError, reset]);

  const onCloseAlert = () => {
    setCurrentAlert(undefined);
  };

  /**
   * Select an epub.
   * Rename also/about (will require changing manifests and toc
   *
   */
  return (
    <>
      <Grid rowSpacing={5} container direction={"row"}>
        <Grid item>
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
        <Grid item container direction={"row"} columnSpacing={5}>
          {epub && epubFile && (
            <Grid item xs={3}>
              <EpubContentsList
                selectCallback={selectCallback}
                sourceZip={epub.sourceZip}
              />
            </Grid>
          )}
          {epub && currentFile && (
            <Grid item xs={9}>
              <EpubEditor
                epub={epub}
                file={currentFile}
                saveChanges={saveChanges}
                generateEpub={generateEpub}
              />
            </Grid>
          )}
        </Grid>
        <Grid item width={600}>
          <AlertSnackbar
            open={!!currentAlert}
            alert={currentAlert}
            onCloseAlert={onCloseAlert}
          />
        </Grid>
      </Grid>
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
