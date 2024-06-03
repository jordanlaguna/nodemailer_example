import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface NotificationAccordionProps {
  message: string;
}

const NotificationAccordion: React.FC<NotificationAccordionProps> = ({
  message
}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Notificación</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{message}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default NotificationAccordion;
