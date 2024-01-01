import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import { Container, IconButton } from '@mui/material';
import { useState } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const InRoomOperations = () => {
    const [isAudioOn, setIsAudioOn] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(false)
    const handleAudioChange = () => {
        setIsAudioOn(!isAudioOn)
        console.log('current mic is: ' + `${isAudioOn ? "on" : "off"}`)
    }

    const handleVideoChange = () => {
        setIsVideoOn(!isVideoOn)
        console.log('current video is: ' + `${isVideoOn ? "on" : "off"}`)
    }
    return (
        <Container>
            <IconButton onClick={handleAudioChange}
            >
                {isAudioOn ? <MicOffIcon></MicOffIcon> : <MicIcon></MicIcon>}
            </IconButton>
            <IconButton onClick={handleVideoChange}>
                {isVideoOn ? <VideocamOffIcon></VideocamOffIcon> : <VideocamIcon></VideocamIcon>}
            </IconButton>
        </Container>
    );
}

export default InRoomOperations