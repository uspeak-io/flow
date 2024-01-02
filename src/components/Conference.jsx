import { Container, TextField } from "@mui/material";
import { Client, LocalStream, RemoteStream } from "ion-sdk-js"
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { useState, useEffect, useRef } from "react";
import VideoView from "./VideoView";
import { Label } from "@mui/icons-material";
const Conference = ({user, room}) => {
    const [streams, setStreams] = useState([])
    const [localStream, setLocalStream] = useState({ stream: null })
    const [audioOn, setAudioOn] = useState(false)
    const [videoOn, setVideoOn] = useState(false)
    
    useEffect(() => {
        const config = {
            codec: 'vp8',
            iceServers: [
                {
                    "urls": "stun:stun.l.google.com:19302",
                }
            ]
        };
        console.log('establishing webrtc connection for room: ', room.id)
        const url = "ws://localhost:7001/ws";
        const signal = new IonSFUJSONRPCSignal(url);
        const client = new Client(signal, config);

        signal.onopen = () => client.join(room.id);

        client.ontrack = (track, stream) => {
            console.log('got track ', track, "for stream: ", stream);
            if (track.kind === 'video') {
                track.onunmute = () => {
                    const videoStream = {
                        stream: stream
                    }
                    setStreams([...streams, videoStream])
                }
            }
        };

        // return () => {
        //     // Cleanup when component unmounts
        //     client.close();
        // };
    }, []);
    return (
        <Container key={"video-container"}>
            <TextField value={"Remote participants"}></TextField>
            {
                streams.map((s, i) => {
                    return (<VideoView
                        key={Math.random()}
                        id={Math.random()}
                        muted={false}
                        stream={s.stream}
                        index={i}
                    >
                    </VideoView>)
                })
            }
        </Container>
    )

}

export default Conference