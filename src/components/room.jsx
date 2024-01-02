import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from "../conf/axiosConfig";
import RoomParticipant from "./RoomParticipant";
import { Button, CardMedia, Container } from "@mui/material";
import MediaStreamPanel from "./Conference";
import Conference from "./Conference";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Room = () => {
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`
    const navigate = useNavigate()
    const { room, user} = useLocation().state 
    const roomId = useParams()
    const [participants, setParticipants] = useState([])

    useEffect(() => {
        console.log('participant len: ', room.participants.participants.length)
        setParticipants(room.participants.participants)
    }, [room])


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
            setParticipants([...updatedParticipants])
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
                    <p>Room ID: {room.id}</p>
                    <p>Room topic: {room.topic}</p>
                    <p>Size: {room.size}</p>
                    <h4>Participants:</h4>
                    <ul>
                        {
                            participants.map(p => {
                                return (
                                    <li key={p.userId}>
                                        <RoomParticipant participant={p}></RoomParticipant>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <Conference room={room} user={user}></Conference>
                    <Button onClick={() => leaveRoom(roomId.roomId, user.id)}>Leave</Button>
                </Container>
            )}
        </Container>
    )

}

export default Room;