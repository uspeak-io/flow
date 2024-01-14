import { Client } from "@stomp/stompjs";

const setupWebsocketClient = (onConnectCallback) => {
  // if (!stompClient) {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8090/ws",
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  // }

  stompClient.activate();
  stompClient.onConnect = (frame) => {
    console.log("STOMP connection established", frame);
    onConnectCallback(stompClient);
  };

  stompClient.onStompError = (frame) => {
    console.error("STOMP protocol error", frame);
  };
  return stompClient
};

export default setupWebsocketClient;
