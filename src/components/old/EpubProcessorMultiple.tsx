import React, { FC, useState, useEffect, ReactNode } from "react";
import EpubService from "../EpubService";
import { useForm } from "react-hook-form";
import ReplacementFile from "../ReplacementFile";
import Button from "@mui/material/Button";

interface ProcProps {
  epubs: File[];
  alsoBy: ReplacementFile;
  about: ReplacementFile;
  targetDirectory?: File;
  replaceCallback?: Function;
  logger: Function;
}

const EpubProcessorMultiple: FC<ProcProps> = ({
  epubs,
  alsoBy,
  about,
  targetDirectory,
  replaceCallback,
  logger,
  ...props
}) => {
  const { handleSubmit } = useForm();
  const [statusLog, setStatusLog] = useState<ReactNode[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const logStatus = async (newStat: string) => {
    await logger(newStat);
  };

  const onSubmitHandler = async () => {
    setProcessing(true);
    await EpubService.processEpubs(epubs, about, alsoBy, logStatus);
    setProcessing(false);
    await logStatus("*****FINISHED PROCESSING*****").then(() => {});
  };

  useEffect(() => {}, [setProcessing, processing]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="row">
          <Button type="submit" value="Process">
            Process
          </Button>
        </div>
      </form>

      <div>{statusLog}</div>
    </>
  );
};
export default EpubProcessorMultiple;
