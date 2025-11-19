import * as React from "react";
import { ButtonBase, Typography, useTheme } from "@mui/material";
import { Home, Groups, Message, ShowChart } from "@mui/icons-material";
import Box from "@mui/material/Box";
import BottomLogo from "../../assets/svgs/BottomLogo5.svg";
import { CustomSvg } from "../../common/CustomSvg";
import { WalletIcon } from "../../assets/Icons/WalletIcon";
import { HubsIcon } from "../../assets/Icons/HubsIcon";
import { TradingIcon } from "../../assets/Icons/TradingIcon";
import { MessagingIcon } from "../../assets/Icons/MessagingIcon";
import AppIcon from "../../assets/svgs/AppIcon.svg";

import { HomeIcon } from "../../assets/Icons/HomeIcon";
import { Save } from "../Save/Save";

export const IconWrapper = ({ children, label, color, selected }) => {
  const theme = useTheme();
  const resolvedColor = color || theme.palette.text.secondary;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap:  "5px",
        flexDirection: "column",
        height: "89px",
        width: "89px",
        borderRadius: "50%",
        backgroundColor: selected ? theme.palette.background.paper : "transparent",
        border: selected ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      {children}
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "12px",
          fontWeight: 500,
          color: selected ? theme.palette.text.primary : resolvedColor,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export const DesktopFooter = ({
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
  hasUnreadDirects,
  isHome,
  isGroups,
  isDirects,
  setDesktopSideView,
  isApps,
  setDesktopViewMode,
  desktopViewMode,
  hide,
  setIsOpenSideViewDirects,
  setIsOpenSideViewGroups
  
}) => {
  const theme = useTheme();
  
  if(hide) return
  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        height: "100px", // Footer height
        zIndex: 1,
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "20px",
        }}
      >
        <ButtonBase
          onClick={() => {
            goToHome();
          }}
        >
          <IconWrapper
            color={theme.palette.text.secondary}
            label="Home"
            selected={isHome}
          >
            <HomeIcon
              height={30}
              color={isHome ? theme.palette.text.primary : theme.palette.text.secondary}
            />
          </IconWrapper>
        </ButtonBase>
        <ButtonBase
          onClick={() => {
            setDesktopViewMode('apps')
            setIsOpenSideViewDirects(false)
            setIsOpenSideViewGroups(false)
          }}
        >
          <IconWrapper
            color={theme.palette.text.secondary}
            label="Apps"
            selected={isApps}
          >
            <img src={AppIcon} />
          </IconWrapper>
        </ButtonBase>
        <ButtonBase
          onClick={() => {
            setDesktopSideView("groups");
          }}
        >
          <IconWrapper
            color={theme.palette.text.secondary}
            label="Groups"
            selected={isGroups}
          >
            <HubsIcon
              height={30}
              color={
                hasUnreadGroups
                  ? "var(--unread)"
                  : isGroups
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary
              }
            />
          </IconWrapper>
        </ButtonBase>
        <ButtonBase
          onClick={() => {
            setDesktopSideView("directs");
          }}
        >
          <IconWrapper
            color={theme.palette.text.secondary}
            label="Messaging"
            selected={isDirects}
          >
            <MessagingIcon
              height={30}
              color={
                hasUnreadDirects
                  ? "var(--unread)"
                  : isDirects
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary
              }
            />
          </IconWrapper>
        </ButtonBase>
        
        <Save isDesktop />
      </Box>
    </Box>
  );
};
