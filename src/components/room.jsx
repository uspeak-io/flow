import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from "../conf/axiosConfig";
import RoomParticipant from "./RoomParticipant";
import { Button, Typography, Container, Card} from "@mui/material";
import MediaStreamPanel from "./Conference";
import Conference from "./Conference";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RoomParticipantList from "./RoomParticipantList";

const Room = () => {
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`
    const navigate = useNavigate()
    const { room, user, participants} = useLocation().state
    const [ activeParticipants, setActiveParticipants] = useState([])
    const roomId = useParams()

    useEffect(() => {
        const ps = participants
        console.log('whatsup bro: ', ps)
        setActiveParticipants(ps)
    }, [activeParticipants])


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
            const updatedParticipants = participants.filter(e => e.userId !== p.userId)
            setActiveParticipants([...updatedParticipants])
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
            {room && (
                <Container>
                    <Typography fontWeight="bold">Room ID: {room.id}</Typography>
                    <Typography fontWeight="bold">Room topic: {room.topic}</Typography>
                    <Typography fontWeight="bold">Size: {room.size}</Typography>
                    <Typography fontWeight="bold">Participants:</Typography>
                    {
                        activeParticipants && (
                            activeParticipants.map(participant => {
                                return (<Card key={participant.userId}>
                                    <Typography>User id: {participant.userId}</Typography>
                                    <Typography>Is host: {participant.isHost.toString()}</Typography>
                                    <Typography>Joined at: {participant.joinedAt}</Typography>
                                </Card>)
                            })
                        )
                    }
                    <Typography>Remote streams: </Typography>
                    <Conference room={room} user={user}></Conference>
                    <Button variant="contained" onClick={() => leaveRoom(roomId.roomId, user.id)}>Leave</Button>
                </Container>
            )}
        </Container>
    )

}

export default Room;