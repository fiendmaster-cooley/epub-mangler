import React, { FC, useCallback, useState } from "react";
import { AppBar, Box, Toolbar, Button, Backdrop } from "@mui/material";
import AboutPanel from "../components/AboutPanel";

interface EpubAppBarProps {
  changeView?: Function;
}

const EpubAppBar: FC<EpubAppBarProps> = ({ changeView }) => {
  const [backdrop, setBackdrop] = useState<boolean>(true);

  const toggle = useCallback(() => {
    setBackdrop(!backdrop);
  }, [setBackdrop, backdrop]);
  return (
    <>
      <Box sx={{ flexGrow: 1, backgroundColor: "gray" }}>
        <AppBar position="static">
          <Toolbar>
            <Button onClick={toggle}>About</Button>
          </Toolbar>
        </AppBar>
      </Box>
      {!backdrop && <AboutPanel />}
    </>
  );
};
export default EpubAppBar;
