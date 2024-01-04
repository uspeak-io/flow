import { Container, Typography } from "@mui/material";
import { Client, LocalStream, RemoteStream } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import VideoView from "./VideoView";
import { Label } from "@mui/icons-material";
const Conference = forwardRef((props, ref) => {
  const { room, user, rtcClient } = props;
  const [streams, setStreams] = useState([]);
  const [localStream, setLocalStream] = useState({ stream: null });
  const [audioOn, setAudioOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  useImperativeHandle(ref, () => ({
    handleLocalStream: (enabled) => doHandleLocalStream(enabled),
    handleRemoteStream: () => doHandleRemoteStream(),
    toggleAudio: () => doToggleAudio(),
    toggleVideo: () => doToggleVideo(),
    handleParticipantLeave: (userId) =>
      doHandleParticipantLeave(userId),
  }));

  useEffect(() => {
    console.log("current client: " + rtcClient);
    doHandleRemoteStream()
  }, []);

  const doToggleAudio = () => {
    setAudioOn(!audioOn);
    console.log("current audio: ", audioOn);
  };

  const doToggleVideo = () => {
    setVideoOn(!videoOn);
    console.log("current video: ", videoOn);
  };

  const doHandleParticipantLeave = (userId) => {
    console.log("user leave: ", userId);
  };

  const doHandleLocalStream = async (enabled) => {
    if (enabled) {
      await LocalStream.getUserMedia({
        audio: true,
        video: true,
        codec: "VP8",
      })
        .then((stream) => {
          rtcClient.publish(stream);
          localStream.stream = stream;
          setLocalStream(localStream);
        })
        .catch((e) => {
          console.error("error while publishing stream: I", e);
        });
    } else {
      if (localStream.stream) {
        unpublish(localStream.stream);
        localStream.stream = null;
        setLocalStream(localStream);
      }
    }
  };

  const doHandleRemoteStream = () => {
    rtcClient.ontrack = (track, stream) => {
      console.log("got remote track: ", track.id, " stream: ", stream.id);
      if (track.kind === "video") {
        track.onunmute = () => {
          let found = false;
          const filtered = streams.filter((e) => e.id == track.id);
          found = filtered.length >= 1;
          if (!found) {
            streams.push({ id: stream.id, stream });
            setStreams([...streams]);
            stream.onremovetrack = () => {
              const _streams = streams.filter((item) => item.id !== stream.id);
              setStreams([..._streams]);
            };
          }
        };
      }
    };
  };

  const unpublish = async (stream) => {
    console.log("stream.unpublish stream=", stream);
    if (stream) {
      await stopMediaStream(stream);
    }
  };

  const stopMediaStream = async (stream) => {
    console.log("stopMediaStream stream=", stream);
    let tracks = stream.getTracks();
    for (let i = 0, len = tracks.length; i < len; i++) {
      await tracks[i].stop();
      console.log("stopMediaStream track=", tracks[i]);
    }
  };

  return (
    <Container key={"remote-stream-container"}>
      {streams.map((s, i) => {
        return (
          <VideoView
            key={Math.random()}
            id={Math.random()}
            muted={false}
            stream={s.stream}
            index={i}
          ></VideoView>
        );
      })}
    </Container>
  );
});

export default Conference;
