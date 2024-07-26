import React, { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import EpubAppBar from "./views/EpubAppBar";
import { Tab, Box, useMediaQuery } from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import EpubExplorer from "./views/EpubExplorer";
import EpubRenamer from "./views/EpubRenamer";
import EpubReplacer from "./views/EpubReplacer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [value, setValue] = useState("2");
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );
  useEffect(() => {}, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <EpubAppBar />
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Epub Explorer" value="2" />
                  <Tab label="Epub Contents Renamer" value="3" />
                  <Tab label="Epub File Replacer" value={"4"} />
                </TabList>
              </Box>
              <TabPanel value="2">
                <EpubExplorer />
              </TabPanel>
              <TabPanel value="3">
                <EpubRenamer />
              </TabPanel>
              <TabPanel value="4">
                <EpubReplacer />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
