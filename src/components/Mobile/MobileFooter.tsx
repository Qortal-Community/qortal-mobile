import * as React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  ButtonBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Home, Groups, Message, ShowChart } from "@mui/icons-material";
import Box from "@mui/material/Box";
import BottomLogo from "../../assets/svgs/BottomLogo5.svg";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";
import { Browser } from '@capacitor/browser';

import { CustomSvg } from "../../common/CustomSvg";
import { WalletIcon } from "../../assets/Icons/WalletIcon";
import { HubsIcon } from "../../assets/Icons/HubsIcon";
import { TradingIcon } from "../../assets/Icons/TradingIcon";
import { MessagingIcon } from "../../assets/Icons/MessagingIcon";
import { executeEvent } from "../../utils/events";

const IconWrapper = ({ children, label, color }) => {
  const theme = useTheme();
  const resolvedColor = color || theme.palette.text.secondary;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "5px",
        flexDirection: "column",
      }}
    >
      {children}
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "12px",
          fontWeight: 500,
          color: resolvedColor,
          wordBreak: 'normal'
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export const MobileFooter = ({
  selectedGroup,
  groupSection,
  isUnread,
  goToAnnouncements,
  isUnreadChat,
  goToChat,
  goToThreads,
  setOpenManageMembers,
  groupChatHasUnread,
  groupsAnnHasUnread,
  directChatHasUnread,
  chatMode,
  openDrawerGroups,
  goToHome,
  setIsOpenDrawerProfile,
  mobileViewMode,
  setMobileViewMode,
  setMobileViewModeKeepOpen,
  hasUnreadGroups,
  hasUnreadDirects
}) => {
  const [value, setValue] = React.useState(0);
  const isSmallScreen = useMediaQuery("(max-width:370px)"); // Define a custom breakpoint
  const theme = useTheme();
  const muted = theme.palette.text.secondary;
  const active = theme.palette.text.primary;
  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        height: "67px", // Footer height
        zIndex: 1,
        borderTopRightRadius: "25px",
        borderTopLeftRadius: "25px",
        boxShadow: `0px -2px 10px ${theme.palette.mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.4)"}`,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ backgroundColor: "transparent", flexGrow: 1 }}
      >
        <BottomNavigationAction
          onClick={() => {
            // setMobileViewMode('wallet')
            setIsOpenDrawerProfile(true);
          }}
          icon={
            <>
            {isSmallScreen ? (
              <WalletIcon color={muted} />
            ) : (
              <IconWrapper color={muted} label="Wallet">
              <WalletIcon color={muted} />
            </IconWrapper>
            )}
            </>
            
          }
          sx={{ color: value === 0 ? active : muted, padding: "0px 10px" }}
        />
        <BottomNavigationAction
          onClick={() => {
            setMobileViewMode("groups");
          }}
          icon={
            <>
              {isSmallScreen ? (
              <HubsIcon color={hasUnreadGroups ? "var(--unread)" : muted} />
              ) : (
              <IconWrapper color={muted} label="Groups">
              <HubsIcon color={hasUnreadGroups ? "var(--unread)" : muted} />
            </IconWrapper>
            )}
            </>
           
          }
          sx={{
            color: value === 0 ? active : muted,
            paddingLeft: isSmallScreen ? '0px' :  "10px",
            paddingRight: isSmallScreen ? '30px' : "42px",
          }}
        />
      </BottomNavigation>

      {/* Floating Center Button */}
      <Box
        sx={{
          position: "absolute",
          bottom: "34px", // Adjusted to float properly based on footer height
          left: "50%",
          transform: "translateX(-50%)", // Center horizontally
          width: "59px",
          height: "59px",
          backgroundColor: theme.palette.background.default,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0 4px 10px ${theme.palette.mode === "light" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.6)"}`, // Subtle shadow for the floating effect
          zIndex: 3,
        }}
      >
        <ButtonBase onClick={()=> {
          if(mobileViewMode === 'home'){
            setMobileViewMode('apps')

          } else {
            setMobileViewMode('home')

          }
        }}>
        <Box
          sx={{
            width: "49px", // Slightly smaller inner circle
            height: "49px",
            backgroundColor: theme.palette.background.default,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Custom Center Icon */}
          <img src={mobileViewMode === 'apps' ? LogoSelected : BottomLogo} alt="center-icon"  />
        </Box>
        </ButtonBase>
      </Box>

      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ backgroundColor: "transparent", flexGrow: 1 }}
      >
        <BottomNavigationAction
          onClick={() => {
            setMobileViewModeKeepOpen("messaging");
          }}
          icon={
            <>
            {isSmallScreen ? (
                         <MessagingIcon color={hasUnreadDirects ? "var(--unread)" : muted} />

            ) : (
              <IconWrapper label="Messaging" color={muted}>
              <MessagingIcon color={hasUnreadDirects ? "var(--unread)" : muted} />
            </IconWrapper>
          )}
          </>
           
          }
          sx={{
            color: value === 2 ? active : muted,
            paddingLeft: isSmallScreen ? '30px' : "55px",
            paddingRight: isSmallScreen ? '0px' : "10px",
          }}
        />
        <BottomNavigationAction
          onClick={async () => {
            executeEvent("addTab", { data: { service: 'APP', name: 'q-trade' } });
          executeEvent("open-apps-mode", { });
          }}
          
          icon={
          
             <>
             {isSmallScreen ? (
              <TradingIcon color={muted} />
 
             ) : (
              <IconWrapper label="Trading" color={muted}>
              <TradingIcon color={muted} />
            </IconWrapper>
           )}
           </>
          }
          sx={{ color: value === 3 ? active : muted, padding: "0px 10px" }}
        />
      </BottomNavigation>
    </Box>
  );
};
