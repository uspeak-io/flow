import { Container, Typography, Card } from "@mui/material"
const RoomParticipantList = ({ participants, user }) => {
    return (
        <div>
            <Typography fontWeight="bold">Participants: </Typography>
            {
                participants && (
                    participants.map(participant => {
                        return (<div>
                            <p>User id: {participant.userId}</p>
                            <p>Is host: {participant.isHost.toString()}</p>
                            <p>Joined at: {participant.joinedAt}</p>
                        </div>)
                    })
                )
            }
        </div>
    )
}

export default RoomParticipantList