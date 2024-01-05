import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Typography } from "@mui/material";
import Conference from "./Conference";
import { useLocation, useParams } from "react-router-dom";
import InRoomToolbar from "./InRoomToolbar";
import * as Ion from "ion-sdk-js/lib/connector";
import Header from "./Header";
import { Client } from "@stomp/stompjs";

const Room = (props) => {
  const { roomInfo, user, participants } = useLocation().state;
  const [peers, setPeers] = useState([]);
  const [connector, setConnector] = useState(null);
  const [rtc, setRtc] = useState(null);
  const roomId = useParams();
  const conferenceRef = useRef();
  const isPageClosing = useRef(false);
  useEffect(() => {
    setPeers(peers.length != 0 ? peers : participants);
    setupWebsocketClient();
    joinRtc(roomInfo.id);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (isPageClosing.current) {
        onParticipantLeave(user.id);
      }
    };
  }, [peers]);

  const setupWebsocketClient = () => {
    const client = new Client({
      brokerURL: "ws://localhost:8090/room",
      onConnect: () => {
        client.subscribe(`/topic/room/${roomInfo.id}`, (message) => {
          console.log("receive room ws message: ", `${message.body}`);
          const body = JSON.parse(message.body);
          const peer = body.payload;
          switch (body.command) {
            case "join": {
              const found = participants.filter((p) => p.userId == peer.userId);
              if (found.length == 0) {
                const _peers = [...participants, peer];
                setPeers(_peers);
              }
              break;
            }
            case "leave": {
              const _peers = peers.filter((p) => p.userId !== peer.userId);
              setPeers(_peers);
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

  const onParticipantLeave = (userId) => {
    const ps = participants.filter((e) => e.userId !== userId);
    setPeers(ps);
    conferenceRef.current.handleParticipantLeave(userId);
  };

  const joinRtc = async (roomId) => {
    console.log("user: ", user.id, " joining room: ", roomInfo.id);
    const config = {
      codec: "vp8",
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    const url = "http://localhost:50051";
    const connector = new Ion.Connector(url, "token");
    setConnector(connector);
    const rtc = new Ion.RTC(connector, config);
    setRtc(rtc);
    rtc.ondatachannel = ({ channel }) => {
      console.log("[ondatachannel] channel=", channel);
      channel.onmessage = ({ data }) => {
        console.log("[ondatachannel] channel onmessage =", data);
      };
    };
    rtc
      .join(roomInfo.id, user.id.toString())
      .then((result) => {
        console.log("rtc join success", result);
      })
      .catch((error) => {
        console.log("rtc join error: ", error);
      });
  };

  const handleBeforeUnload = (evt) => {
    isPageClosing.current = true;
  };

  return (
    <Container>
      <Header user={user}></Header>
      {roomInfo && (
        <Container>
          <Typography fontWeight="bold">Room ID: {roomInfo.id}</Typography>
          <Typography fontWeight="bold">
            Room topic: {roomInfo.topic}
          </Typography>
          <Typography fontWeight="bold">Size: {roomInfo.size}</Typography>
          <Typography fontWeight="bold">
            Participants ({participants.length}):
          </Typography>
          {peers &&
            peers.map((participant) => {
              return (
                <Card key={participant.userId}>
                  <Typography>User id: {participant.userId}</Typography>
                  <Typography>Display name: {participant.displayName}</Typography>
                  <Typography>
                    Is host: {participant.isHost.toString()}
                  </Typography>
                  <Typography>Joined at: {participant.joinedAt}</Typography>
                </Card>
              );
            })}
          <InRoomToolbar
            room={roomInfo}
            user={user}
            onParticipantLeave={onParticipantLeave}
            conferenceRef={conferenceRef}
          ></InRoomToolbar>
          <Typography>Remote streams: </Typography>
          {rtc && (
            <Conference
              peers={peers}
              roomInfo={roomInfo}
              user={user}
              ref={conferenceRef}
              rtc={rtc}
            ></Conference>
          )}
        </Container>
      )}
    </Container>
  );
};

export default Room;
