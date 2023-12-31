const RoomParticipant = ({participant}) => {
    console.log('participant here: ', participant)
    return (
        <div>
            <p>User id: {participant.userId}</p>
            <p>Is host: {participant.isHost.toString()}</p>
            <p>Joined at: {participant.joinedAt}</p>
        </div>
    )
}

export default RoomParticipant