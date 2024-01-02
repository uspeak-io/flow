import { Button, Container} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AxiosInstance from "../conf/axiosConfig";
const RoomPreview = (props) => {
    const { room, user } = props
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`
    const navigate = useNavigate()
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
            navigate(`/rooms/${roomId}`, {state: {
                room: room,
                user: user
            }})
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <Container key={room.id}>
            <p>Room ID: {room.id}</p>
            <p>Room topic: {room.topic}</p>
            <p>Size: {room.size}</p>
            <Button onClick={() => joinRoom(room.id, user.id)}>Join</Button>
        </Container>
    )
}

export default RoomPreview