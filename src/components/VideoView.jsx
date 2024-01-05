import { Card, CardMedia, Container, Typography } from "@mui/material";
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
    <Card variant="outlined" sx={{maxWidth: '210px'}}>
      <Typography>{participant.userId}</Typography>
      <video
        className="small-video-view"
        key={id}
        autoPlay={true}
        playsInline
        muted={true}
        id={id}
        width={"100%"}
        height={"130px"}
        ref={videoRef}
      ></video>
    </Card>
  );
};

export default VideoView;
