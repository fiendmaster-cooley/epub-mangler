import React, { ReactNode } from "react";
import { FC } from "react";
import {} from "react-hook-form";
import { Box } from "@mui/material";
import { JSZipObject } from "jszip";
import Epub from "./Epub";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import "../App.css";
interface EpubFilesProps {
  selectCallback: Function;
  epub: Epub;
}

const EpubFiles: FC<EpubFilesProps> = ({ selectCallback, epub }) => {
  const renderRows = () => {
    const files = epub.sourceZip.folder("OEBPS");
    const fileMap: Map<string, JSZipObject> = new Map();
    const xmlTypes = [".xhtml", ".opf", ".ncx"];

    files!.forEach((relativePath: string, file: JSZipObject) => {
      for (let i = 0; i < xmlTypes.length; i++) {
        if (file.name.endsWith(xmlTypes[i])) {
          fileMap.set(file.name, file);
        }
      }
    });

    const mapAsc = new Map(
      [...fileMap.entries()].sort(([, a], [, b]) => {
        return a.name.localeCompare(b.name);
      }),
    );
    const selectHandler = (z: JSZipObject) => {
      return selectCallback(z);
    };
    const rows: ReactNode[] = [];
    const values = Array.from(mapAsc.values());
    values.forEach((val: JSZipObject) => {
      rows.push(
        <MenuItem
          value={val.name}
          key={val.name}
          onClick={() => selectHandler(val)}
        >
          {val.name}
        </MenuItem>,
      );
    });
    return rows;
  };
  return (
    <>
      {" "}
      <Box>
        <Select label={"Select a file"}>{renderRows()}</Select>
      </Box>
    </>
  );
};
export default EpubFiles;
