import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Typography } from "@mui/material";
import Conference from "./Conference";
import { useLocation, useParams } from "react-router-dom";
import InRoomToolbar from "./InRoomToolbar";
import * as Ion from "ion-sdk-js/lib/connector";
import Header from "./Header";
import { Client } from "@stomp/stompjs";
import setupWebsocketClient from "./WsClient";

const Room = (props) => {
  const { roomInfo, user, participants } = useLocation().state;
  const [peers, setPeers] = useState(participants);
  const [rtc, setRtc] = useState(null);
  const roomId = useParams();
  const conferenceRef = useRef();
  const isPageClosing = useRef(false);

  useEffect(() => {
    joinRtc(roomInfo.id);
    setupWebsocketClient(subscribeWsTopics);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (isPageClosing.current) {
        // onParticipantLeave(user.id);
      }
    };
  }, []);

  useEffect(() => {
    console.log('use effect peers: ', peers)
  }, [peers])

  const subscribeWsTopics = (stompClient) => {
    stompClient.subscribe(`/topic/room/${roomInfo.id}`, (message) => {
      const body = JSON.parse(message.body);
      const peer = body.payload;
      switch (body.command) {
        case "join": {
          console.log("participant joining: ", peer);
          const found = peers.filter((p) => p.userId == peer.userId);
          if (found.length == 0) {
            const _peers = [...peers, peer];
            console.log("participant list: ", _peers);
            setPeers(_peers);
          }
          break;
        }
        case "leave": {
          console.log("participant leaving: ", peer);
          console.log("peer list: ", peers);
          const _peers = peers.filter((p) => p.userId !== peer.userId);
          console.log("peers after one peer leave: ", _peers);
          setPeers([..._peers]);
          break;
        }
        default: {
          break;
        }
      }
    });
  };

  const onParticipantLeave = (userId) => {
    const ps = peers.filter((e) => e.userId !== userId);
    setPeers([...ps]);
    conferenceRef.current.handleParticipantLeave(userId);
  };

  const joinRtc = async (roomId) => {
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
            peers.map((p) => {
              return (
                <Card key={p.userId}>
                  <Typography>User id: {p.userId}</Typography>
                  <Typography>Display name: {p.displayName}</Typography>
                  <Typography>Is host: {p.isHost.toString()}</Typography>
                  <Typography>Joined at: {p.joinedAt}</Typography>
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
