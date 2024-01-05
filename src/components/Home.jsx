import React, { useState, useEffect, useRef, forwardRef } from 'react'
import AxiosInstance from '../conf/axiosConfig'
import Room from './Room'
import CreateRoomForm from './CreateRoomForm'
import { Box, Container, Typography } from '@mui/material'
import MediaStreamPanel from './Conference'
import { useLocation } from 'react-router-dom'
import Conference from './Conference'
import RoomPreview from './RoomPreview'
import Header from './Header'

const Home = () => {
    const location = useLocation()
    const endpoint = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`;
    const [activeRooms, setActiveRooms] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        const user = location.state.user
        console.log('user: ', user)
        setUser(user)
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
            {
                user && (
                    <Header user={user}></Header>
                )
            }
            <CreateRoomForm user={user} onRoomCreated={handleRoomCreated}></CreateRoomForm>
            {
                activeRooms.map(room =>
                    <RoomPreview 
                        room={room} 
                        user={user}
                        key={room.id}
                    >
                    </RoomPreview>
                )
            }
        </Container>
    )
}

export default Home