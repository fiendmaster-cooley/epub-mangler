import React from "react";
import { FC } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../App.css";
import { Box, Tooltip } from "@mui/material";

interface UploadButtonProps {
  fieldName: string;
  title: string;
  theWatch: Function[]; //these are directly from useform. How to type?
  register: Function;
  multiple?: boolean;
  accept: string | ".xhtml";
  getValues: Function;
}

const UploadButton: FC<UploadButtonProps> = ({
  fieldName,
  title,
  theWatch,
  register,
  multiple,
  accept,
  getValues,
}) => {
  const getFileValues = (): string => {
    const fileValues = Array.from(theWatch) || [];
    let values = "";
    for (let i = 0; i < fileValues.length; i++) {
      values = values.concat(`${fileValues[i].name}\n`);
    }

    return values;
  };
  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <label htmlFor={fieldName + "upload"}>
          <input
            accept={accept}
            style={{ display: "none" }}
            id={fieldName + "upload"}
            multiple
            type="file"
            {...register(fieldName)}
            key={fieldName + "upload"}
          />
          <Tooltip title={"Choose file to open."}>
            <Button
              component="span"
              id={fieldName + "btn"}
              style={{ minWidth: 125 }}
            >
              {title}
            </Button>
          </Tooltip>
        </label>
        <TextField
          id={fieldName + "tf"}
          value={getFileValues()}
          disabled
          fullWidth={true}
          multiline={multiple}
          style={{ width: "400" }}
        />
      </Box>
    </>
  );
};
export default UploadButton;
