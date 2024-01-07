import React, { useState } from 'react';
import { Navigate, useHistory, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate()
  const handleLogin = () => {
    navigate("/", {
        state: {
            user: {
                username: username,
                id: Math.floor((Math.random() * 100))
            }
        }
    })
  };

  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
