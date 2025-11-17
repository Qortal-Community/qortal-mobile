import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getBaseApiReact } from "../App";

export interface NodeStatusPayload {
  isMintingPossible?: boolean;
  isSynchronizing?: boolean;
  syncPercent?: number;
  numberOfConnections?: number;
  height?: number;
}

export type NodeConnectionState = "online" | "syncing" | "offline" | "unknown";

interface UseNodeStatusOptions {
  pollInterval?: number;
}

interface UseNodeStatusResult {
  data: NodeStatusPayload | null;
  status: NodeConnectionState;
  isFetching: boolean;
  lastUpdated: number | null;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useNodeStatus = (
  options: UseNodeStatusOptions = {}
): UseNodeStatusResult => {
  const pollInterval = options.pollInterval ?? 10000;
  const [data, setData] = useState<NodeStatusPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchStatus = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsFetching(true);
    try {
      const response = await fetch(`${getBaseApiReact()}/admin/status`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Unable to retrieve node status");
      }

      const payload = (await response.json()) as NodeStatusPayload;

      if (!mountedRef.current) {
        return;
      }

      setData(payload);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err: any) {
      if (!mountedRef.current) {
        return;
      }

      if (err?.name === "AbortError") {
        return;
      }

      console.error("Failed to fetch node status", err);
      setError(err?.message || "Unable to retrieve node status");
    } finally {
      if (mountedRef.current) {
        setIsFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    if (pollInterval <= 0) {
      return;
    }

    const intervalId = window.setInterval(fetchStatus, pollInterval);
    return () => window.clearInterval(intervalId);
  }, [fetchStatus, pollInterval]);

  const status: NodeConnectionState = useMemo(() => {
    if (error && !isFetching) {
      return "offline";
    }

    if (!data) {
      return "unknown";
    }

    const syncing = Boolean(
      data.isSynchronizing ||
        (typeof data.syncPercent === "number" && data.syncPercent < 100)
    );

    return syncing ? "syncing" : "online";
  }, [data, error, isFetching]);

  return {
    data,
    status,
    isFetching,
    lastUpdated,
    error,
    refresh: fetchStatus,
  };
};
