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
import setupWebsocketClient  from "./WsClient";


const Home = () => {
  const location = useLocation();
  const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`;
  const [activeRooms, setActiveRooms] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = location.state.user;
    setUser(user);
    fetchAllActiveRooms();
    setupWebsocketClient(handleRoomBroadcasted)
  }, []);


  const handleRoomBroadcasted = (stompClient) => {
    stompClient.subscribe(`/topic/rooms/`, message => {
        const body = `${message.body}`
        const parsedBody = JSON.parse(body);
        const command = parsedBody.command
        console.log('command: ', command)
        switch (command) {
            case "create": {
                addActiveRoom(parsedBody.payload)
                break
            }
            default: {
                break
            }
        }
    })
  }


  const addActiveRoom = (room) => {
    const found = activeRooms.filter(r => r.id === room.id).length >= 1
    if (!found) {
        const rooms = [...activeRooms, room]
        setActiveRooms(rooms)
    }
  }

  const fetchAllActiveRooms = async () => {
    try {
      const response = await AxiosInstance.get(endpoint + "/");
      const rooms = response.data.payload.rooms.values;
      setActiveRooms(rooms);
    } catch (error) {
      console.log("error while fetching active rooms", error);
    }
  };

  const handleRoomCreated = (newRoom) => {
    setActiveRooms([...activeRooms, newRoom]);
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
