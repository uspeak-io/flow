import { Container } from "@mui/material"
import { useEffect, useRef } from "react"

const VideoView = (props) => {
    const videoRef = useRef(null)
    useEffect(() => {
        videoRef.current.srcObject = props.stream
        return () => {
            videoRef.current.srcObject = null
        }
    }, [])
    const {id, stream, muted} = props
    return (
        <Container>
            <video key={id} 
            autoPlay={true}
            playsInline
            muted={true}
            id={id}
            ref={videoRef}>
            </video>
        </Container>
    )
}

export default VideoView
