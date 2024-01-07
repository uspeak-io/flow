import { useState } from "react"
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AxiosInstance from "../conf/axiosConfig";
import { Container } from "@mui/material";

const CreateRoomForm = ({user, onRoomCreated}) => {
    const [open, setOpen] = useState(false)
    const [size, setSize] = useState(2)
    const [topic, setTopic] = useState('')
    const URL = `${process.env.REACT_APP_SLIGHT_ROOM_URL}`

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSizeChange = (event) => {
        const size = event.target.value
        console.log('size: ', size)
        setSize(size)
    }

    const handleSubmitCreateRoom = async () => {
        setOpen(false)
        const endpoint = `${URL}/create`
        try {
            const response = await AxiosInstance.post(endpoint, {
                userId: user.id,
                topic: topic,
                size: size
            })
            const activeRoom = response.data.payload
            onRoomCreated(activeRoom)
        } catch(error) {
            console.log('fail to create room, ', error)
        }
    }

    const handleTopicChange = (event) => {
        const topic = event.target.value
        setTopic(topic)
    }

    return (
        <Container sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create room
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="topic"
                        label="Enter topic..."
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleTopicChange}
                    />
                    <InputLabel id="size-label">Size: </InputLabel>
                    <Select sx={{ m: 1, minWidth: 120 }}
                        labelId="size-label-id"
                        id="size-id"
                        value={size}
                        label="Size"
                        onChange={handleSizeChange}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmitCreateRoom}>Create</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default CreateRoomForm