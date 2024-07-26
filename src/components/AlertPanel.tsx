import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
interface AlertPanelProps {
  items: ReactNode[];
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
        <Stack direction={"column"}>{items}</Stack>
      </Box>
    </>
  );
};
export default AlertPanel;
