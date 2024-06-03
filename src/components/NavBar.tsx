import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import NotificationAccordion from "@/components/NotificationAccordion";

interface NavbarProps {
  notifications: string[];
}

const Navbar: React.FC<NavbarProps> = ({ notifications }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mi Aplicación
        </Typography>
        <IconButton color="inherit" onClick={handleClick}>
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: 300
            }
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem key={index} onClick={() => {}}>
                <NotificationAccordion message={notification} />
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleClose}>No hay notificaciones</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
