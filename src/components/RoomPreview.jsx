import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosInstance from "../conf/axiosConfig";
const RoomPreview = (props) => {
    const { room, user } = props
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`
    const navigate = useNavigate()
    const [participants, setParticipants] = useState([])
    useEffect(() => {
        console.log('len: ', room.participants.participants.length)
        setParticipants(room?.participants?.participants)
    }, [room])
    const joinRoom = async (roomId, userId) => {
        console.log('user: ', user)
        try {
            console.log('user: ', user)
            const response = await AxiosInstance.post(`${endpoint}/join`, null, {
                params: {
                    roomId: roomId,
                    userId: userId
                }
            })
            const p = response.data.payload;
            const ps = [...participants, p]
            setParticipants(ps)
            navigate(`/rooms/${roomId}`, {
                state: {
                    room: room,
                    user: user,
                    participants: ps
                }
            })
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <Container key={room.id}>
            <Typography>Room ID: {room.id}</Typography>
            <Typography>Room topic: {room.topic}</Typography>
            <Typography>Size: {room.size}</Typography>
            <Button variant="contained" onClick={() => joinRoom(room.id, user.id)}>Join</Button>
        </Container>
    )
}

export default RoomPreview