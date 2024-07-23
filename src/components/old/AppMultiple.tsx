import React, { useState } from "react";
import { useEffect } from "react";
import { ReactNode } from "react";
import EpubComponentMultiple from "./EpubComponentMultiple";
import EpubProcessorMultiple from "./EpubProcessorMultiple";
import ReplacementFile from "../ReplacementFile";
import "./App.css";

const loadStrings = {
  also: "also-by",
  about: "about",
};

function AppMultiple() {
  const [also, setAlso] = useState<ReplacementFile>();
  const [about, setAbout] = useState<ReplacementFile>();
  const [targetDirectory, setTargetDirectory] = useState<File>();
  const [files, setFiles] = useState<File[]>([]);
  const [log, setLog] = useState<ReactNode[]>([]);

  async function logMessage(message: string) {
    let newMessage = <div>{message}</div>;
    let messages = log;
    messages.push(newMessage);
    setLog(messages);
  }

  const convertFileToString = (file: File, callBack: Function) => {
    const fr = new FileReader();
    fr.readAsText(file);
    fr.addEventListener("loadend", (event) => {
      callBack(event.target?.result);
    });
  };

  useEffect(() => {}, []);
  return (
    <div className="App">
      <div className="row">
        {
          <EpubComponentMultiple
            filesCallback={(files: File[], alsoFile: File, aboutFile: File) => {
              setFiles(files);
              convertFileToString(alsoFile, (str: string) => {
                setAlso({ file: alsoFile, name: loadStrings.also, xml: str });
              });
              convertFileToString(aboutFile, (str: string) => {
                setAbout({
                  file: aboutFile,
                  name: loadStrings.about,
                  xml: str,
                });
              });
              setTargetDirectory(targetDirectory);
            }}
          />
        }
      </div>
      <div>
        {files.length > 0 && (
          <EpubProcessorMultiple
            about={about!}
            alsoBy={also!}
            epubs={files}
            replaceCallback={() => {}}
            logger={logMessage}
          />
        )}
      </div>
      <div>
        <div>{log}</div>
      </div>
    </div>
  );
}
export default AppMultiple;
