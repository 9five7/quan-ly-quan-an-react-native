import { io } from "socket.io-client";
import { URL } from "src/constants/config";
import { getAccessTokenFromStorage } from "src/utils/utils";

const socket = io(URL, {
  transports: ["websocket"],
  auth: {
    Authorization: `Bearer ${getAccessTokenFromStorage}`,
  },
});

export default socket;
