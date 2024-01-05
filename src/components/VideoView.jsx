import { Container, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

const VideoView = (props) => {
  const { user, id, stream, participant, peers, streamToPeer } = props;
  const videoRef = useRef(null);
  useEffect(() => {
    console.log('peers: ', peers)
    console.log('stream to peer: ', streamToPeer)
    console.log('participant: ', participant)
    videoRef.current.srcObject = props.stream.stream;
  }, []);
  return (
    <Container>
      {/* <Typography>{participant.userId}</Typography> */}
      <video
        key={id}
        autoPlay={true}
        playsInline
        muted={true}
        id={id}
        ref={videoRef}
      ></video>
    </Container>
  );
};

export default VideoView;
