import { Box, Button, Grid, Tooltip } from "@mui/material";
import { FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import UploadButton from "./UploadButton";
interface FileUploaderProps {
  submitHandler: SubmitHandler<FieldValues>;
  fieldName: string;
  title: string;
  getValues: Function;
  resetParent: Function;
}
const FileUploader: FC<FileUploaderProps> = ({
  submitHandler,
  fieldName,
  title,
  getValues,
  resetParent,
  ...props
}) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const watchFile = watch(fieldName, "");

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Grid direction={"row"} container>
          <Grid item>
            <Box component="section" alignItems={"center"} display={"flex"}>
              <UploadButton
                fieldName={fieldName}
                register={register}
                title={title}
                theWatch={watchFile}
                accept={".epub"} //we should really add an accept so we can use this for any file.
                getValues={getValues}
              />
              <Tooltip
                title={"Load the selected file into memory for processing."}
              >
                <Button type="submit" value="Load">
                  Load
                </Button>
              </Tooltip>
              <Tooltip title={"Start over"}>
                <Button
                  type="reset"
                  onClick={() => {
                    reset();
                    resetParent();
                  }}
                >
                  Reset
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
export default FileUploader;
