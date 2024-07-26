import React, { useCallback } from "react";
import { FC } from "react";
import JSZip, { JSZipObject } from "jszip";
import { List, ListItemButton, ListItemText, Select } from "@mui/material";

/**
 * @param sourceZip the epub's zip property
 * @param selectCallback Passes the iterated zip object
 * @param xhtmlOnly only show files with the .xhtml extension
 * @param asSelect renders the component as a select instead of a list.
 */
interface EpubContentsListProps {
  sourceZip: JSZip;
  selectCallback: (zip: JSZipObject) => void;
  xhtmlOnly?: boolean | false;
  asSelect?: boolean | false;
}
/**
 */
const EpubContentsList: FC<EpubContentsListProps> = ({
  sourceZip,
  selectCallback,
  xhtmlOnly,
  asSelect,
}) => {
  const handleCallback = useCallback(
    (evt: any, e: JSZipObject) => {
      evt.target.selected = true;
      selectCallback(e);
    },
    [selectCallback],
  );

  const getSelect = () => {
    const zipObjects: JSZipObject[] = [];
    sourceZip.forEach((relativePath: string, e: JSZipObject) => {
      if (
        e.name.indexOf("OEBPS/") === -1 ||
        e.name.indexOf("OEBPS/css") === 0 ||
        e.name.indexOf("OEBPS/fonts") === 0 ||
        e.name.indexOf("OEBPS/images") === 0 ||
        e.name.localeCompare("OEBPS/") === 0
      ) {
        return;
      } else if (xhtmlOnly && !e.name.endsWith(".xhtml")) {
        return;
      } else {
        zipObjects.push(e);
      }
    });
    zipObjects.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    const getEpubListItems: any = () => {
      return (
        <>
          {zipObjects.map((e) => {
            return (
              <ListItemButton
                onClick={(f: any) => {
                  handleCallback(f, e);
                }}
                key={e.name}
              >
                <ListItemText>{e.name}</ListItemText>
              </ListItemButton>
            );
          })}
        </>
      );
    };

    //now that we're finally sorted and whatnot
    return (
      <div>
        <header>Epub Files</header>

        {!asSelect && (
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 500,
              "& ul": { padding: 0 },
            }}
          >
            {getEpubListItems()}
          </List>
        )}
        {asSelect && <Select>{getEpubListItems()}</Select>}
      </div>
    );
  };

  return <>{getSelect()}</>;
};
export default EpubContentsList;
