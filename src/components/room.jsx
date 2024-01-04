import React from "react";
import { useState, useEffect, useRef } from "react";
import AxiosInstance from "../conf/axiosConfig";
import { Button, Typography, Container, Card } from "@mui/material";
import Conference from "./Conference";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InRoomToolbar from "./InRoomToolbar";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { Client, LocalStream, RemoteStream } from "ion-sdk-js";

const Room = (props) => {
  console.log('room info: ', useLocation().state)
  const { room, user, participants } = useLocation().state;
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [rtcClient, setRtcClient] = useState(null);
  const roomId = useParams();
  const conferenceRef = useRef();
  const isPageClosing = useRef(false)
  useEffect(() => {
    // Add event listener when the component mounts
    
  }, []);

  useEffect(() => {
    const ps = participants;
    setActiveParticipants(ps);
    joinRtc(room.id);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (isPageClosing.current) {
        onParticipantLeave(user.id)  
      }
    };
  }, []);

  const onParticipantLeave = (userId) => {
    const ps = participants.filter((e) => e.userId !== userId);
    setActiveParticipants([...ps]);
    conferenceRef.current.handleParticipantLeave(userId);
  };

  const joinRtc = (roomId) => {
    const config = {
      codec: "vp8",
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    console.log("establishing webrtc connection for room: ", roomId);
    const url = "ws://localhost:7001/ws";
    const signal = new IonSFUJSONRPCSignal(url);
    const client = new Client(signal, config);
    signal.onopen = () => client.join(roomId);
    setRtcClient(client);
  }


  const handleBeforeUnload = evt => {
    isPageClosing.current = true
  }

  return (
    <Container>
      { room && (
        <Container>
          <Typography fontWeight="bold">Room ID: {room.id}</Typography>
          <Typography fontWeight="bold">Room topic: {room.topic}</Typography>
          <Typography fontWeight="bold">Size: {room.size}</Typography>
          <Typography fontWeight="bold">
            Participants ({participants.length}):
          </Typography>
          {activeParticipants &&
            activeParticipants.map((participant) => {
              return (
                <Card key={participant.userId}>
                  <Typography>User id: {participant.userId}</Typography>
                  <Typography>
                    Is host: {participant.isHost.toString()}
                  </Typography>
                  <Typography>Joined at: {participant.joinedAt}</Typography>
                </Card>
              );
            })}
          <InRoomToolbar
            room={room}
            user={user}
            onParticipantLeave={onParticipantLeave}
            conferenceRef={conferenceRef}
          ></InRoomToolbar>
          <Typography>Remote streams: </Typography>
          { rtcClient && (
            <Conference
              room={room}
              user={user}
              ref={conferenceRef}
              rtcClient={rtcClient}
            ></Conference>
          )}
        </Container>
      )}
    </Container>
  );
};

export default Room;
