import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from "../conf/axiosConfig";
import RoomParticipant from "./roomParticipant";


const Room = ({ room, user }) => {
    const URL = `${process.env.REACT_APP_SLIGHT_ENDPOINT}/api/v1/rooms`
    const joinRoom = async (roomId, userId) => {
        try {
            const response = await AxiosInstance.post(`${URL}/join`, null, {
                params: {
                    roomId: roomId,
                    userId: userId
                }
            })
            console.log('join response: ', response)
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
                    room.participants.participants.map(p => {
                        return (
                            <li key={p.userId}>
                                <RoomParticipant participant={p}></RoomParticipant>
                            </li>
                        );
                    })
                }
            </ul>
            <button onClick={() => joinRoom(room.id, user.id)}>Join</button>{' '}
        </div>
    )

}

export default Room;