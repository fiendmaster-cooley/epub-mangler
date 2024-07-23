import React from "react";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../App.css";
interface EpubComponentMultipleProps {
  filesCallback: Function;
}

const EpubComponentMultiple: FC<EpubComponentMultipleProps> = ({
  filesCallback,
  ...props
}) => {
  const { register, handleSubmit, getValues, watch, reset } = useForm();
  const watchAlso = watch("also", "");
  const watchAbout = watch("about", "");
  const watchFiles = watch("files", "");

  const onSubmitHandler = async (data: any) => {
    filesCallback(data.files, data.also[0], data.about[0]);
  };
  const validate = () => {
    const vals = getValues();
    if (
      vals["also"]?.length > 0 &&
      vals["about"]?.length > 0 &&
      vals["files"]?.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.debug(value, name, type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getUploadButton = (
    fieldName: string,
    title: string,
    theWatch: any,
    multiple?: boolean,
  ) => {
    let accept = "*.xhtml";
    if (fieldName === "files") {
      accept = "*.epub";
    }
    return (
      <>
        <input
          accept={accept}
          style={{ display: "none" }}
          id={fieldName + "upload"}
          multiple
          type="file"
          {...register(fieldName)}
          key={fieldName + "upload"}
        />
        <label htmlFor={fieldName + "upload"}>
          <Button component="span" id={fieldName + "btn"}>
            Select File
          </Button>
          <TextField
            id={fieldName + "tf"}
            value={(theWatch.length > 0 && theWatch[0].name) || ""}
            disabled
            multiline
          />
        </label>
      </>
    );
  };

  const getSubmit = () => {
    if (validate()) {
      return (
        <div className="row">
          <Button type="submit" value="Validate">
            Validate
          </Button>
          <Button
            type="reset"
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div>
          <div className="row">
            <div className="column">
              <label>Also by Replacement File</label>
            </div>
            <div className="column">
              {getUploadButton("also", "Choose", watchAlso)}
            </div>
          </div>
          <div className="row">
            <div className="column">
              <label>About Replacement File</label>
            </div>
            <div className="column">
              {getUploadButton("about", "Choose", watchAbout, true)}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>Select Epubs</label>
          </div>
          <div className="column">
            {getUploadButton("files", "Choose", watchFiles)}
          </div>
        </div>
        {getSubmit()}
      </form>
    </>
  );
};
export default EpubComponentMultiple;
