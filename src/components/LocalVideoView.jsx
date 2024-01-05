import { useRef } from "react"
import VideoView from "./VideoView"

const LocalVideoView = (props) => {
    const streamRef = useRef()
    useEffect(() => {
        if (props.stream) {
            streamRef.current.srcObject = props.stream
        }
        return () => {
            streamRef.current.srcObject = null
        }
    })

    return (
        <VideoView {...props}>
            
        </VideoView>
    )
}