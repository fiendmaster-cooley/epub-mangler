import React, { FC, PropsWithChildren } from "react";
import { Snackbar } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import EpubAlert from "./EpubAlert";

/**
 * @param alert the alert to render.
 * @param open whether or not to render the snackbar
 * @param function to call when the alert closes.
 */
export interface AlertSnackbarProps {
  alert: EpubAlert | undefined;
  open: boolean;
  onCloseAlert: () => void;
}

const AlertSnackbar: FC<PropsWithChildren<AlertSnackbarProps>> = ({
  alert,
  open,
  onCloseAlert,
  ...props
}) => {
  if (open) {
    return (
      <>
        <Snackbar
          open={open}
          onClose={() => onCloseAlert()}
          autoHideDuration={6000}
        >
          <Alert severity={alert?.severity}>
            <AlertTitle>{alert?.alertTitle}</AlertTitle>
            <div>{alert?.alertMessage}</div>
          </Alert>
        </Snackbar>
      </>
    );
  } else {
    return <></>;
  }
};
export default AlertSnackbar;
