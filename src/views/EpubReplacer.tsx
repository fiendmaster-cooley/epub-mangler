import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import {
  Alert,
  AlertColor,
  AlertTitle,
  Box,
  Button,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "../App.css";
import EpubAlert from "../components/EpubAlert";
import EpubService from "../components/EpubService";
import FileUploader from "../components/FileUploader";
import ReplacementFile from "../components/ReplacementFile";
import UploadButton from "../components/UploadButton";
const EpubReplacer: FC = () => {
  const { register, handleSubmit, getValues, watch, reset } = useForm();
  const [epubFiles, setEpubFiles] = useState<File[]>([]);
  const watchAlso = watch("also", "");
  const watchAbout = watch("about", "");
  const [snackbarContentArray, setSnackbarContentArray] = useState<
    ReactJSXElement[]
  >([]);

  const convertFileToString = useCallback(async (file: File) => {
    const result = await file.text();
    return result;
  }, []);

  useEffect(() => {}, [getValues, convertFileToString]);

  const addAlert = useCallback(
    (alert: EpubAlert) => {
      const al = (
        <Alert
          key={alert.alertMessage}
          severity={alert.severity}
          onClose={(e) => {
            snackbarContentArray.pop();
            setSnackbarContentArray(snackbarContentArray);
          }}
        >
          <AlertTitle>{alert.alertTitle}</AlertTitle>
          {alert.alertMessage}
        </Alert>
      );
      const newArray = snackbarContentArray.concat([al]);
      setSnackbarContentArray(newArray);
    },
    [snackbarContentArray, setSnackbarContentArray],
  );

  /**
   * Add an alert if there are no epub files.
   */
  const process = useCallback(
    async (data: any) => {
      const also: ReplacementFile = {
        name: data.also[0].name,
        file: data.also[0],
        xml: await convertFileToString(data.also[0]),
      };
      const about: ReplacementFile = {
        name: data.about[0].name,
        file: data.about[0],
        xml: await convertFileToString(data.about[0]),
      };

      EpubService.processEpubs(epubFiles, about, also, (message: string) => {
        let severity: AlertColor = "info";
        if (message.includes("error")) {
          severity = "error";
        }
        addAlert({
          alertMessage: message,
          alertTitle: "Processor status",
          severity: severity,
        });
      });
    },
    [convertFileToString, epubFiles, addAlert],
  );

  const onReset = () => {
    //reset the form..
    reset();
    setEpubFiles([]);
  };

  const onSubmitHandler = async (data: any) => {
    if (data.epubFile.length === 0) {
      addAlert({
        alertMessage: "Choose a valid epub",
        alertTitle: "Invalid epub",
        severity: "error",
      });
      return;
    } else {
      setEpubFiles(data.epubFile);
      addAlert({
        alertMessage: "Epubs chosen and references loaded",
        severity: "info",
        alertTitle: "Epubs loaded",
      });
    }
    console.debug(getValues());
    //
  };

  const getStack = useCallback(() => {
    return <Stack>{snackbarContentArray}</Stack>;
  }, [snackbarContentArray]);
  return (
    <Grid container rowSpacing={5}>
      <Grid item container direction={"row"}>
        <FileUploader
          fieldName="epubFile"
          submitHandler={onSubmitHandler}
          title={"Select Epubs"}
          getValues={getValues}
          resetParent={() => onReset()}
        />
      </Grid>
      {epubFiles && epubFiles.length > 0 && (
        <Grid item container rowSpacing={5} direction={"row"}>
          <Box display="flex" alignItems={"center"}>
            <UploadButton
              fieldName="about"
              register={register}
              title="Select 'About File'"
              multiple={false}
              theWatch={watchAbout}
              accept=".xhtml"
              getValues={getValues}
            />

            {getValues("about") && getValues("about").length === 1 && (
              <Tooltip title="A prefix the epub file uses for its About file">
                <TextField
                  defaultValue={"about"}
                  {...register("aboutPattern")}
                />
              </Tooltip>
            )}
          </Box>
        </Grid>
      )}
      {getValues("about") && getValues("about").length === 1 && (
        <Grid item container direction={"row"}>
          <Grid item alignContent={"center"}>
            <Box display={"flex"} alignItems={"center"}>
              <UploadButton
                fieldName="also"
                register={register}
                theWatch={watchAlso}
                title={"Select 'Also By' File"}
                accept=".xhtml"
                multiple={false}
                getValues={getValues}
              />
              {getValues("also") && getValues("also").length === 1 && (
                <Tooltip
                  title={"A prefix the epub file uses for its Also By file"}
                >
                  <TextField
                    defaultValue={"also"}
                    {...register("alsoByPattern")}
                  />
                </Tooltip>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
      {getValues("about") && getValues("about").length === 1 && (
        <Grid item container direction={"row"} zeroMinWidth={true} xs={6}>
          <Box display="flex" alignContent={"center"}>
            <Tooltip
              title={
                "Replace 'About' and 'Also by' in epub and generate new epub."
              }
            >
              <Button
                type="submit"
                value="Process epubs"
                onClick={handleSubmit(process)}
              >
                Process
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      )}

      <Grid item container>
        <Snackbar
          open={snackbarContentArray.length > 0}
          autoHideDuration={6000}
        >
          <Stack>{getStack()}</Stack>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default EpubReplacer;