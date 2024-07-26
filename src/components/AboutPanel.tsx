import { FC } from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";
import "../App.css";
const AboutPanel: FC = () => {
  return (
    <Box
      display={"flex"}
      alignItems={"left"}
      flexDirection={"column"}
      component={"span"}
      style={{ margin: "10" }}
    >
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 20 }} gutterBottom>
            About EpubMangler
          </Typography>

          <Typography>
            {
              "Paul E Cooley needed a way to update the 'about-the-author' and 'also-by' files inside multiple epubs."
            }
          </Typography>
          <Typography>
            {
              "Epub mangler also allows you to rename individual files and generate new epubs."
            }
          </Typography>
          <Typography>{"This IS a work in progress..."}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
export default AboutPanel;
