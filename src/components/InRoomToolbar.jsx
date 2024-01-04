import { Container, Button, IconButton } from "@mui/material"
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useEffect, useRef, useState } from "react";
import AxiosInstance from "../conf/axiosConfig";
import { useNavigate } from "react-router-dom";
const InRoomToolbar = (props, ref) => {
    const { room, user, onParticipantLeave, conferenceRef} = props;
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`
    const navigate = useNavigate()
    const [ isAudioOn, setIsAudioOn ] = useState(false)
    const [ isVideoOn, setIsVideoOn ] = useState(false)

    const handleAudioChange = () => {
        conferenceRef.current.toggleAudio(!isAudioOn)
        setIsAudioOn(!isAudioOn)
    }

    const handleVideoChange = () => {
        conferenceRef.current.handleLocalStream(!isVideoOn)
        setIsVideoOn(!isVideoOn)
    }

    const leaveRoom = async (roomId, userId) => {
        try {
            const response = await AxiosInstance.post(`${endpoint}/leave`, null, {
                params: {
                    roomId: roomId,
                    userId: userId
                }
            })
            const p = response.data.payload
            console.log('leave participant: ', p)
            conferenceRef.current.handleLocalStream(false)
            onParticipantLeave(p.userId)
            navigate("/", {
                state: {
                    user,
                    room
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Container>
            <Button variant="contained" onClick={() => leaveRoom(room.id, user.id)}>Leave</Button>
            <IconButton onClick={handleAudioChange} variant="contained">
                {isAudioOn ? <MicOffIcon></MicOffIcon> : <MicIcon></MicIcon>}
            </IconButton>
            <IconButton onClick={handleVideoChange} variant="contained">
                {isVideoOn ? <VideocamOffIcon></VideocamOffIcon> : <VideocamIcon></VideocamIcon>}
            </IconButton>

        </Container>
    )
}

export default InRoomToolbar