import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin } = useContext(AuthContext);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedPassword) {
            setPassword(storedPassword);
        }
    }, []);

    const handleLoginClick = () => {
        handleLogin(username, password);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    p: 3,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Вход
                </Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Пароль"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLoginClick}
                    sx={{ mt: 2 }}
                >
                    Войти
                </Button>
            </Box>
        </Container>
    );
};

export default LoginForm;
