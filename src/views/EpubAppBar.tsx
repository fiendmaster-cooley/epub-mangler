import React, { FC, useCallback, useState } from "react";
import { AppBar, Box, Toolbar, Button, Backdrop } from "@mui/material";
import AboutPanel from "../components/AboutPanel";

interface EpubAppBarProps {
  changeView?: Function;
}

const EpubAppBar: FC<EpubAppBarProps> = ({ changeView }) => {
  const [backdrop, setBackdrop] = useState<boolean>();

  const toggle = useCallback(() => {
    setBackdrop(!backdrop);
  }, [setBackdrop, backdrop]);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: "gray" }}>
          <Toolbar>
            <Button onClick={toggle}>About</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Backdrop open={!backdrop} onClick={toggle}>
        <AboutPanel />
      </Backdrop>
    </>
  );
};
export default EpubAppBar;
