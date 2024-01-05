import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, forwardRef } from "react";
import AxiosInstance from "../conf/axiosConfig";
import { Client } from "@stomp/stompjs";

const RoomPreview = (props) => {
  const { room, user } = props;
  const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`;
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    setupWebsocketClient();
    setParticipants(room?.participants?.participants);
  }, [room]);

  const setupWebsocketClient = () => {
    const client = new Client({
      brokerURL: "ws://localhost:8090/room",
      onConnect: () => {
        client.subscribe(`/topic/room/${room.id}`, (message) => {
          console.log("receive room ws message: ", `${message.body}`);
          const body = JSON.parse(message.body);
          const peer = body.payload;
          switch (body.command) {
            case "join": {
              const found = participants.filter((p) => p.userId == peer.userId);
              if (found.length == 0) {
                const _peers = [...participants, peer];
                setParticipants(_peers);
              }
              break;
            }
            case "leave": {
              const _peers = participants.filter(
                (p) => p.userId !== peer.userId
              );
              setParticipants(_peers);
              break;
            }
            default: {
              break;
            }
          }
        });
      },
    });
    client.activate();
  };

  const joinRoom = async (roomId, userId, displayName) => {
    try {
      const response = await AxiosInstance.post(`${endpoint}/join`, null, {
        params: {
          roomId: roomId,
          userId: userId,
          displayName: displayName 
        },
      });
      const p = response.data.payload;
      const ps = [...participants, p];
      setParticipants(ps);
      navigate(`/rooms/${roomId}`, {
        state: {
          roomInfo: room,
          user: user,
          participants: ps,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container key={room.id}>
      <Typography>Room ID: {room.id}</Typography>
      <Typography>Room topic: {room.topic}</Typography>
      <Typography>Size: {room.size}</Typography>
      <Button variant="contained" onClick={() => joinRoom(room.id, user.id, user.username)}>
        Join
      </Button>
    </Container>
  );
};

export default RoomPreview;
