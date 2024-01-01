import React, { useState, useEffect } from 'react'
import AxiosInstance from '../conf/axiosConfig'
import Room from './room'
import CreateRoomForm from './createRoomForm'
import { Container } from '@mui/material'
import InRoomOperations from './inRoomOperations'

const Home = () => {
    const [activeRooms, setActiveRooms] = useState([])
    const [user, setUser] = useState({
        "id": 69,
        "displayName": "namvdo"
    })
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`;
    useEffect(() => {
        fetchAllActiveRooms()
    }, [])


    const fetchAllActiveRooms = async () => {
        try {
            console.log('endpoint: ', endpoint)
            const response = await AxiosInstance.get(endpoint + "/")
            const rooms = response.data.payload.rooms
            console.log('rooms: ', rooms);
            setActiveRooms(rooms)
        } catch (error) {
            console.log('error while fetching active rooms', error)
        }
    }

    const handleRoomCreated = (newRoom) => {
        setActiveRooms([...activeRooms, newRoom])
    }

    return (
        <Container>
            <h3>Active rooms</h3>
            <CreateRoomForm user={user} onRoomCreated={handleRoomCreated}></CreateRoomForm>
            <ul>
                {
                    activeRooms.map(room =>
                        <Container>
                            <li key={room.id}>
                                <Room room={room} user={user}>
                                </Room>
                            </li>
                            <InRoomOperations></InRoomOperations>
                        </Container>
                    )
                }
            </ul>
        </Container>
    )
}

export default Home