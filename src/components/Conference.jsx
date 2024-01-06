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
const Conference = forwardRef((props, ref) => {
  const STREAM_KIND_LOCAL = "local";
  const STREAM_KIND_REMOTE = "remote";
  const { roomInfo, user, rtc, peers, onAddedStream } = props;
  const [streamToPeer, setStreamToPeer] = useState({});
  const [streams, setStreams] = useState([]);
  const [audioOn, setAudioOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  useImperativeHandle(ref, () => ({
    handleLocalStream: (enabled) => doHandleLocalStream(enabled),
    handleRemoteStream: () => doHandleRemoteStream(),
    toggleAudio: () => doToggleAudio(),
    toggleVideo: () => doToggleVideo(),
    handleParticipantLeave: (userId) => doHandleParticipantLeave(userId),
  }));

  useEffect(() => {
    doHandleRemoteStream();
  }, [rtc]);


  console.log('442 participants: ', peers)

  const doToggleAudio = () => {
    setAudioOn(!audioOn);
  };

  const doToggleVideo = () => {
    setVideoOn(!videoOn);
  };

  const doHandleParticipantLeave = (userId) => {
    console.log("user leave: ", userId);
  };

  const getParticipantInfo = (uid) => {
    const result = peers.filter((peer) => {
      return peer.userId == uid;
    });
    return result[0];
  };

  const doHandleLocalStream = async (enabled) => {
    if (enabled) {
      await LocalStream.getUserMedia({
        audio: true,
        video: true,
        codec: "VP8",
      })
        .then((stream) => {
          rtc.publish(stream);
          const localStream = createLocalStream(stream);
          const _streams = [...streams, localStream];
          setStreams(_streams);
          const stp = {
            ...streamToPeer,
            [stream.id]: getParticipantInfo(user.id),
          };
          setStreamToPeer(stp);
        })
        .catch((e) => {
          console.error("error while publishing stream: ", e);
        });
    } else {
      const localStream = getLocalStream();
      if (localStream && localStream.stream) {
        unpublishStream(localStream)
      }
    }
  };

  const unpublishStream = (stream) => {
    setStreamToPeer((prev) => {
      const updated = { ...prev };
      if (updated[stream.stream.id]) {
        delete updated[stream.stream.id];
        return updated;
      }
      return prev;
    });
    unpublish(stream.stream);
    stream.stream = null;
    const _streams = streams.filter((e) => e.kind !== STREAM_KIND_LOCAL);
    const updatedStreams = [..._streams, stream];
    setStreams(updatedStreams);
  };

  const createLocalStream = (stream) => {
    const _stream = {
      stream: stream,
      kind: STREAM_KIND_LOCAL,
      id: stream.id,
      user: user,
    };
    return _stream;
  };

  const getLocalStream = () => {
    return streams.filter((stream) => stream.kind == STREAM_KIND_LOCAL)[0];
  };

  const doHandleRemoteStream = () => {
    rtc.ontrackevent = (ev) => {
      console.log(
        "[ontrackevent]: \nuid = ",
        ev.uid,
        " \nstate = ",
        ev.state,
        ", \ntracks = ",
        JSON.stringify(ev.tracks)
      );

      ev.tracks.forEach((track) => {
        if (!streamToPeer[track.stream_id] && track.kind === "video") {
          const ps = {
            ...streamToPeer,
            [track.stream_id]: getParticipantInfo(ev.uid),
          };
          setStreamToPeer(ps);
        }
      });
    };

    rtc.ontrack = (track, stream) => {
      console.log("got remote track: ", track.id, " stream: ", stream.id);
      if (track.kind === "video") {
        track.onunmute = () => {
          let found = false;
          const filtered = streams.filter((e) => e.id == track.id);
          found = false
          if (!found) {
            const remoteStream = {
              id: stream.id,
              kind: STREAM_KIND_REMOTE,
              stream: stream,
            };
            streams.push(remoteStream);
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
            peers={peers}
            streamToPeer={streamToPeer}
            participant={streamToPeer[s.id]}
            key={Math.random()}
            id={Math.random()}
            muted={false}
            stream={s}
            index={i}
          ></VideoView>
        );
      })}
    </Container>
  );
});

export default Conference;