import React, { FC, PropsWithChildren } from "react";
import { Snackbar } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
export interface AlertSnackbarProps {
  alertTitle: string | undefined;
  alertMessage: string | undefined;
  open: boolean;
  severity: any;
  onCloseAlert: Function;
}
const AlertSnackbar: FC<PropsWithChildren<AlertSnackbarProps>> = ({
  alertTitle,
  alertMessage,
  open,
  severity,
  onCloseAlert,
  ...props
}) => {
  if (open) {
    return (
      <Snackbar
        open={open}
        onClose={() => onCloseAlert()}
        autoHideDuration={6000}
      >
        <Alert severity={severity}>
          <AlertTitle>{alertTitle}</AlertTitle>
          <div>{alertMessage}</div>
        </Alert>
      </Snackbar>
    );
  } else {
    return <></>;
  }
};
export default AlertSnackbar;
