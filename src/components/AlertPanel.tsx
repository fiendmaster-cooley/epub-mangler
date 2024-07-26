import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Snackbar } from "@mui/base";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
interface AlertPanelProps {
  items: ReactJSXElement[];
}
const AlertPanel: FC<AlertPanelProps> = ({ items, ...props }) => {
  return (
    <>
      <Box display={"flex"} flexDirection={"column"}>
        <AppBar position={"static"}>
          <Toolbar>
            <Typography>Processing Status</Typography>
          </Toolbar>
        </AppBar>
        <Snackbar open={items && items.length > 0} autoHideDuration={5 * 1000}>
          {items}
        </Snackbar>
      </Box>
    </>
  );
};
export default AlertPanel;
