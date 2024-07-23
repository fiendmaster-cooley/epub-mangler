import {
  AlertColor,
  Box,
  Button,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import { JSZipObject } from "jszip";
import { FC, useCallback, useState } from "react";
import "../App.css";
import AlertSnackbar from "../components/AlertSnackbar";
import Epub from "../components/Epub";
import EpubAlert from "../components/EpubAlert";
import EpubContentsList from "../components/EpubContentsList";
import EpubService from "../components/EpubService";
import FileReplacer from "../components/FileReplacer";
import FileUploader from "../components/FileUploader";
import { useForm } from "react-hook-form";

interface EpubRenamerProps {}
/**
 * Simple application for choosing an epub, displaying its files, and
 * giving the user the option of renaming files within the epub.
 */
const EpubRenamer: FC<EpubRenamerProps> = ({ ...props }) => {
  const [epub, setEpub] = useState<Epub>();
  const [epubFile, setEpubFile] = useState<File>();
  const [currentZip, setCurrentZip] = useState<JSZipObject>();
  const [alert, setAlert] = useState<EpubAlert>();
  const [newFileName, setNewFileName] = useState<string>();
  const [generateVisible, setGenerateVisible] = useState<boolean>();
  const [newEpubName, setNewEpubName] = useState<string>();
  const { getValues } = useForm();
  const onSubmitHandler = useCallback(
    (data: any) => {
      setGenerateVisible(false);
      //there can be only one!
      if (data.files.length !== 1) {
        setAlert({
          alertTitle: "Invalid File",
          alertMessage: "Choose a valid epub file.",
          severity: "error",
        });
      } else {
        const file = data.files[0];
        setEpubFile(file);
        EpubService.openEpubFromBuffer(
          file,
          (e: Epub) => {
            setEpubFile(file);
            setEpub(e);
          },
          async (message: string) => {
            let severity: AlertColor = "info";
            if (message.toLowerCase().includes("error")) {
              severity = "error";
            } else if (message.toLowerCase().includes("success")) {
              severity = "success";
            }
            setAlert({
              alertMessage: message,
              alertTitle: severity.toUpperCase(),
              severity: severity,
            });
          },
        );
      }
    },
    [setAlert, setEpub, setEpubFile, setGenerateVisible],
  );

  const getAlert = useCallback(() => {
    if (alert) {
      const handleClose = () => {
        setAlert(undefined);
      };
      return (
        <AlertSnackbar onCloseAlert={handleClose} open={true} {...alert} />
      );
    } else {
      return <></>;
    }
  }, [alert, setAlert]);

  const handleItemCallback = useCallback(
    (e: JSZipObject) => {
      setCurrentZip(e);
      setNewFileName(e.name.split("OEBPS/")[1]);
    },
    [setCurrentZip, setNewFileName],
  );

  const replaceFileSubmit = useCallback(async () => {
    console.debug("new file name:\t" + newFileName);
    if (!newFileName || !newFileName.endsWith(".xhtml")) {
      setAlert({
        alertMessage: "File must be valid xhtml and name must end with '.epub'",
        alertTitle: "Error",
        severity: "error",
      });
      return;
    }
    const oldFileName = currentZip!.name;
    let newEpub = await EpubService.renameFile(
      epub!,
      oldFileName.split("OEBPS/")[1],
      newFileName!,
    );

    epub!.sourceZip = newEpub.sourceZip;
    setCurrentZip(epub?.sourceZip.file("OEBPS/" + newFileName)!);
    setAlert({
      alertMessage: `Successfully renamed ${oldFileName} to ${newFileName}`,
      alertTitle: "Success",
      severity: "success",
    });
    setGenerateVisible(true);
  }, [epub, currentZip, setAlert, newFileName]);

  const handleGenerate = useCallback(async () => {
    //check to see if new epub name has .epub
    if (!newEpubName || !newEpubName.endsWith(".epub")) {
      setAlert({
        alertMessage: "New epub name must with suffix '.epub'",
        alertTitle: "Error",
        severity: "error",
      });
      return;
    }
    await EpubService.generateEpub(epub!, newEpubName!, (message: string) => {
      setAlert({
        alertMessage: message,
        alertTitle: "Success",
        severity: "success",
      });
    });
  }, [epub, newEpubName, setAlert]);

  const handleNewEpubName = (e: any) => {
    setNewEpubName(e.target.value);
  };

  const onReset = () => {
    setEpub(undefined);
    setNewFileName(undefined);
    setCurrentZip(undefined);
    setEpubFile(undefined);
    setAlert(undefined);
  };

  return (
    <>
      <Grid container spacing={1} columnGap={5} rowSpacing={5}>
        <Grid item xs={12}>
          <FileUploader
            fieldName={"files"}
            submitHandler={onSubmitHandler}
            title={"Select Epub"}
            getValues={getValues}
            resetParent={onReset}
            {...props}
          />
        </Grid>
        {epub && epubFile && (
          <Grid item xs={3}>
            <EpubContentsList
              sourceZip={epub!.sourceZip}
              selectCallback={handleItemCallback}
            />
          </Grid>
        )}
        {currentZip && (
          <Grid item xs={4}>
            <FileReplacer
              currentFile={currentZip!}
              submitter={replaceFileSubmit}
              setFileName={setNewFileName}
              newFileName={newFileName}
            />
          </Grid>
        )}
        {generateVisible && (
          <Grid item xs={5}>
            <Box>
              <TextField
                helperText={"File must end in '.epub'"}
                style={{ width: "80%" }}
                label="Generate epub with name"
                value={newEpubName}
                onChange={handleNewEpubName}
              />
              <Tooltip
                title={
                  "Enter a new filename for the generated epub.\nMust have the '.epub' file extension"
                }
              >
                <Button onClick={handleGenerate}>Generate Epub</Button>
              </Tooltip>
            </Box>
          </Grid>
        )}
      </Grid>
      {getAlert()}
    </>
  );
};
export default EpubRenamer;
