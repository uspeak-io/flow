import { Card, CardMedia, Container, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
const VideoView = (props) => {
  const { user, id, stream, peers } = props;
  const videoRef = useRef(null);
  useEffect(() => {
    // if (participant && props.stream && props.stream.stream) {
      if (!videoRef.current.srcObject) {
        videoRef.current.srcObject = props.stream.stream;
      }
    // }
    }, [])
  // }, [participant, props.stream, peers, streamToPeer]);
  return (
    <Container>
      {/* {participant && ( */}
        <Card variant="outlined" sx={{ maxWidth: "210px" }}>
          {/* <Typography>{participant.userId}</Typography> */}
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
      {/* )} */}
    </Container>
  );
};

export default VideoView;
