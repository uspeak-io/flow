import React, { useState, useEffect } from 'react'
import AxiosInstance from '../conf/axiosConfig'
import Room from './room'

const Home = () => {
    const [activeRooms, setActiveRooms] = useState([])
    const [user, setUser] = useState({
        "id": 69,
        "displayName": "namvdo"
    })
    const ENDPOINT = `${process.env.REACT_APP_SLIGHT_ENDPOINT}/api/v1/rooms/`;
    useEffect(() => {
        fetchAllActiveRooms()
    }, [])


    const fetchAllActiveRooms = async () => {
        try {
            const response = await AxiosInstance.get(`${ENDPOINT}`)
            console.log('response: ', response.data.payload.rooms);
            setActiveRooms(response.data.payload.rooms)
        } catch (error) {
            console.log('error while fetching active rooms', error)
        }
    }

    return (
        <div>
            <h3>Active rooms</h3>
            <ul>
                {
                    activeRooms.map(room =>
                        <li key={room.id}>
                            <Room room={room} user={user}>
                            </Room>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default Home