import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import { isMobile } from '../../App';
export const DrawerComponent = ({open, setOpen, children}) => {
  const theme = useTheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

 
  return (
    <div>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box
          sx={{
            width: isMobile ? '100vw' : '400px',
            height: '100%',
            bgcolor: theme.palette.background.default,
          }}
          role="presentation"
        >
          {children}
        </Box>
      </Drawer>
    </div>
  );
}
