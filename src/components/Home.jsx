import React, { useState, useEffect, useRef, forwardRef } from "react";
import AxiosInstance from "../conf/axiosConfig";
import Room from "./Room";
import CreateRoomForm from "./CreateRoomForm";
import { Box, Container, Typography } from "@mui/material";
import MediaStreamPanel from "./Conference";
import { useLocation } from "react-router-dom";
import Conference from "./Conference";
import RoomPreview from "./RoomPreview";
import Header from "./Header";
import { Client } from "@stomp/stompjs";
import setupWebsocketClient from "./WsClient";

const Home = () => {
  const location = useLocation();
  const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`;
  const [activeRooms, setActiveRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [wsClient, setWsClient] = useState(null)

  useEffect(() => {
    const user = location.state.user;
    setUser(user);
    fetchAllActiveRooms(user);
    setWsClient(setupWebsocketClient(handleRoomBroadcasted));
  }, []);

  const handleRoomBroadcasted = (stompClient) => {
    stompClient.subscribe(`/topic/rooms/`, (message) => {
      const body = `${message.body}`;
      const parsedBody = JSON.parse(body);
      const command = parsedBody.command;
      console.log("get CREATE command: ", parsedBody);
      switch (command) {
        case "create": {
          addActiveRoom(parsedBody.payload);
          break;
        }
        default: {
          break;
        }
      }
    });
  };

  const addActiveRoom = (room) => {
    const exists = activeRooms.filter((r) => r.id === room.id);
    if (exists.length == 0) {
      setActiveRooms((prevRooms) => {
        return [room, ...prevRooms];
      });
    }
  };

  const fetchAllActiveRooms = async (user) => {
    try {
      const response = await AxiosInstance.get(endpoint + "/");
      let rooms;
      if (activeRooms && activeRooms.length != 0) {
        rooms = [response.data.payload.rooms.values, ...activeRooms];
      } else {
        rooms = response.data.payload.rooms.values;
      }
      const sorted = getRoomsSorted(rooms, user);
      setActiveRooms(sorted);
    } catch (error) {
      console.log("error while fetching active rooms", error);
    }
  };

  const handleRoomCreated = (newRoom) => {
    console.log("active rooms: ", JSON.stringify(activeRooms));
    setActiveRooms([newRoom, ...activeRooms]);
  };

  const getRoomsSorted = (activeRooms, user) => {
    const currentUserRoom = activeRooms.filter((room) => {
      const exist = room?.participants?.participants.filter((p) => {
        return p.userId == user.id;
      });
      return exist && exist.length >= 1;
    });
    let activeRoomWithoutUserRoom = activeRooms;
    if (currentUserRoom.length != 0) {
      for (let i = 0; i < activeRoomWithoutUserRoom.length; i++) {
        for (let j = 0; j < currentUserRoom.length; j++) {
          if (activeRoomWithoutUserRoom[i].id == currentUserRoom[j].id) {
            activeRoomWithoutUserRoom.splice(i, 1);
          }
        }
      }
    }
    return [...currentUserRoom, ...activeRoomWithoutUserRoom];
  };

  return (
    <Container>
      {user && <Header user={user}></Header>}
      <CreateRoomForm
        user={user}
        onRoomCreated={handleRoomCreated}
      ></CreateRoomForm>
      {activeRooms.map((room) => (
        <RoomPreview room={room} user={user} key={room.id}></RoomPreview>
      ))}
    </Container>
  );
};

export default Home;
