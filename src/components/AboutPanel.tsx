import { FC } from "react";

import { Box, CardContent, Typography } from "@mui/material";

const AboutPanel: FC = () => {
  return (
    <Box display={"flex"} alignItems={"center"}>
      <CardContent style={{ backgroundColor: "whitesmoke" }}>
        <Typography sx={{ fontSize: 14 }} color={"text.secondary"} gutterBottom>
          About EpubMangler
        </Typography>
        <div>
          {
            "Paul E Cooley needed a way to update the 'about-the-author' and 'also-by' files inside multiple epubs."
          }
        </div>
        <div>
          {
            "Epub mangler also allows you to rename individual files and generate new epubs."
          }
        </div>
        <div>{"This IS a work in progress..."}</div>
      </CardContent>
    </Box>
  );
};
export default AboutPanel;
