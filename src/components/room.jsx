import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from "../conf/axiosConfig";
import RoomParticipant from "./roomParticipant";


const Room = ({ room, user }) => {
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`
    const [participants, setParticipants] = useState([])


    useEffect(() => {
        console.log('participant len: ', room.participants.participants.length)
        setParticipants(room.participants.participants)
    }, [room])
    
    const joinRoom = async (roomId, userId) => {
        try {
            const response = await AxiosInstance.post(`${endpoint}/join`, null, {
                params: {
                    roomId: roomId,
                    userId: userId
                }
            })
            const p = response.data.payload;
            console.log('joined participant: ', p)
            setParticipants([...participants, p])
        } catch (error) {
            console.error(error)
        }
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
            const updatedParticipants = participants.filter(e => e.userId !== p.userId) 
            setParticipants([...updatedParticipants])
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
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
            <button onClick={() => joinRoom(room.id, user.id)}>Join</button>{' '}
            <button onClick={() => leaveRoom(room.id, user.id)}>Leave</button>{' '}
        </div>
    )

}

export default Room;