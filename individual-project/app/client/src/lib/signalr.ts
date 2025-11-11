import * as signalR from "@microsoft/signalr";
import { API } from "./config";
import { toast } from "sonner";

/**
 * SignalR connection instance
 */
let connection: signalR.HubConnection | null = null;

/**
 * Get or create SignalR connection
 * @param accessToken - JWT token for authentication
 * @returns SignalR HubConnection instance
 */
export const getSignalRConnection = (
  accessToken?: string
): signalR.HubConnection => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  const baseUrl = API.BASE_URL.replace("/api", "");
  const hubUrl = `${baseUrl}/hubs/app`;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => accessToken || "",
      transport:
        signalR.HttpTransportType.WebSockets |
        signalR.HttpTransportType.ServerSentEvents |
        signalR.HttpTransportType.LongPolling,
      withCredentials: true,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext: signalR.RetryContext) => {
        if (retryContext.previousRetryCount === 0) return 0;
        if (retryContext.previousRetryCount === 1) return 2000;
        if (retryContext.previousRetryCount === 2) return 10000;
        return 30000;
      },
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();
  connection.onclose((_error?: Error) => {
    toast.error("SignalR connection closed");
  });

  connection.onreconnecting((_error?: Error) => {
    toast.loading("SignalR reconnecting...");
  });

  connection.onreconnected((_connectionId?: string) => {
    toast.success("SignalR reconnected.");
  });

  return connection;
};

/**
 * Start SignalR connection
 * @param accessToken - Optional JWT token for authentication
 */
export const startSignalRConnection = async (
  accessToken?: string
): Promise<void> => {
  const conn = getSignalRConnection(accessToken);

  if (conn.state === signalR.HubConnectionState.Connected) {
    toast.info("SignalR already connected");
    return;
  }

  try {
    await conn.start();
  } catch (error) {
    throw error;
  }
};

/**
 * Stop SignalR connection
 */
export const stopSignalRConnection = async (): Promise<void> => {
  if (
    connection &&
    connection.state !== signalR.HubConnectionState.Disconnected
  ) {
    try {
      await connection.stop();
    } catch (error) {
      toast.error("Error stopping SignalR connection");
    } finally {
      connection = null;
    }
  }
};

/**
 * Get current connection state
 */
export const getConnectionState = (): signalR.HubConnectionState => {
  return connection?.state ?? signalR.HubConnectionState.Disconnected;
};

/**
 * Check if connection is connected
 */
export const isConnected = (): boolean => {
  return connection?.state === signalR.HubConnectionState.Connected;
};
