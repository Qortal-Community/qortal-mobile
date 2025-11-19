import {
  Box,
  ButtonBase,
  Popover,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getBaseApiReact } from "../../App";
import { manifestData } from "../../ExtStates/NotAuthenticated";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import syncedImg from "../../assets/syncStatus/synced.webp";
import syncedMintingImg from "../../assets/syncStatus/synced_minting.webp";
import syncingImg from "../../assets/syncStatus/syncing.webp";
import packageJson from "../../../package.json";
import { subscribeToEvent, unsubscribeFromEvent } from "../../utils/events";

const HTTP_LOCALHOST_12391 = "http://127.0.0.1:12391";
const CORE_INFO_REFRESH_MS = 30000;
const APP_VERSION = packageJson.version || "";

interface CoreInfoResponse {
  buildVersion?: string;
}

interface StatusPresentation {
  icon: string;
  title: string;
  message: string;
}

interface InfoRow {
  label: string;
  value: string;
  highlight?: boolean;
}

const nodeDisplay = (url?: string) => {
  if (!url) {
    return "—";
  }

  if (url === HTTP_LOCALHOST_12391) {
    return "Local";
  }

  if (url.includes("ext-node.qortal")) {
    return "Public";
  }

  return url.replace(/\/+$/, "");
};

const clampPercent = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.floor(value)));
};

export const NodeStatusIndicator = () => {
  const { data, error } = useNodeStatus({ pollInterval: 12000 });
  const [coreInfo, setCoreInfo] = useState<CoreInfoResponse>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const nodeBase = getBaseApiReact();
  const isUsingGateway = nodeBase?.includes("ext-node.qortal.link") ?? false;
  const isLocalNode = nodeBase === HTTP_LOCALHOST_12391;

  useEffect(() => {
    let mounted = true;
    let timeoutId: number | undefined;

    const fetchCoreInfo = async () => {
      try {
        const response = await fetch(`${getBaseApiReact()}/admin/info`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch core info");
        }

        const payload = (await response.json()) as CoreInfoResponse;
        if (mounted) {
          setCoreInfo(payload);
        }
      } catch (err) {
        console.error("Failed to fetch core info", err);
      } finally {
        if (mounted) {
          timeoutId = window.setTimeout(fetchCoreInfo, CORE_INFO_REFRESH_MS);
        }
      }
    };

    fetchCoreInfo();

    return () => {
      mounted = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleNativeBack = (evt: Event) => {
      evt?.stopImmediatePropagation?.();
      handleClose();
    };

    subscribeToEvent("handleMobileNativeBack", handleNativeBack);
    return () =>
      unsubscribeFromEvent("handleMobileNativeBack", handleNativeBack);
  }, [isOpen, handleClose]);

  const statusPresentation: StatusPresentation = useMemo(() => {
    if (!data && error) {
      return {
        icon: syncingImg,
        title: "Status unavailable",
        message: "Unable to retrieve node status.",
      };
    }

    const percent = clampPercent(data?.syncPercent);
    const syncing = Boolean(data?.isSynchronizing && percent !== 100);
    const minting = Boolean(data?.isMintingPossible && !isUsingGateway);

    const baseLabel = syncing ? "Synchronizing" : "Synchronized";
    const mintingLabel = isUsingGateway
      ? "Not minting"
      : minting
      ? "Minting"
      : "Not minting";

    let icon = syncingImg;
    if (!syncing && minting) {
      icon = syncedMintingImg;
    } else if (!syncing) {
      icon = syncedImg;
    }

    const message = data
      ? `${baseLabel} ${percent}% · ${mintingLabel}`
      : "Waiting for node status…";

    return {
      icon,
      title: data ? baseLabel : "Status unknown",
      message,
    };
  }, [data, error, isUsingGateway]);

  const infoRows: InfoRow[] = useMemo(
    () => [
      {
        label: "Core version",
        value: coreInfo?.buildVersion
          ? coreInfo.buildVersion.substring(0, 20)
          : "—",
      },
      {
        label: "Status",
        value: statusPresentation.message,
      },
      {
        label: "Block height",
        value:
          typeof data?.height === "number"
            ? data.height.toLocaleString()
            : "—",
      },
      {
        label: "Peers",
        value:
          typeof data?.numberOfConnections === "number"
            ? data.numberOfConnections.toString()
            : "—",
      },
      {
        label: "Using node",
        value: nodeDisplay(nodeBase),
        highlight: isLocalNode,
      },
      {
        label: "UI version",
        value: APP_VERSION || manifestData.version || "—",
      },
    ],
    [coreInfo, data, nodeBase, statusPresentation.message, isLocalNode]
  );

  return (
    <>
      <ButtonBase
        sx={{
          borderRadius: "50%",
          padding: 0,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={statusPresentation.message}
        onClick={handleOpen}
        disableRipple
      >
        <Box
          component="img"
          src={statusPresentation.icon}
          alt={statusPresentation.title}
          sx={{
            width: 30,
            height: "auto",
            filter: isOpen ? "drop-shadow(0 0 8px rgba(0,0,0,0.45))" : "none",
          }}
        />
      </ButtonBase>

      <Popover
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderRadius: "10px",
              border: "1px solid var(--sidebar-border)",
              minWidth: 260,
              padding: "16px",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
            Core information
          </Typography>

          {infoRows.map((row) => (
            <Box
              key={row.label}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "rgba(255, 255, 255, 0.55)",
                }}
              >
                {row.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: row.highlight ? 600 : 500,
                  color: row.highlight ? "var(--green)" : "rgba(255, 255, 255, 0.95)",
                  wordBreak: "break-word",
                }}
              >
                {row.value}
              </Typography>
            </Box>
          ))}

          {error && (
            <Typography sx={{ fontSize: "12px", color: "var(--danger)" }}>
              {error}
            </Typography>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NodeStatusIndicator;
