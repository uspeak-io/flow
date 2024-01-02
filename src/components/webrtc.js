import { Client, LocalStream, RemoteStream } from "ion-sdk-js"
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

const config = {
    codec: 'vp8',
    iceServers: [
        {
            "urls": "stun:stun.l.google.com:19302",
        }
    ]
}

const url = "ws://localhost:7001/ws"
const signal = new IonSFUJSONRPCSignal(url) 
const client = new Client(signal, config)
signal.onopen = () => client.join("test room")

client.ontrack = (track, stream) => {
    console.log('got track ', track.id, "for stream: ", stream.id)
    if (track.kind == 'video') {
        track.onunmute = () => {
        }
    }
}
