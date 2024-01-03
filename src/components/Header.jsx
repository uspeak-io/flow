import { Container, Menu, MenuItem, Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Header = ({ user }) => {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        navigate("/login")
    }
    return (
        <Container sx={{textAlign: 'right'}}>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {user.username}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Container>
    )
}

export default Header