// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getProfile, updatePassword } from '../api';

function ProfilePage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                setEmail(profile.email);
            } catch (error) {
                toast.error('Failed to fetch profile information');
                navigate('/login'); // Redirect to login if unauthenticated
            }
        };

        fetchProfile();
    }, [navigate]);

    const handlePasswordUpdate = async () => {
        try {
            await updatePassword(newPassword);
            toast.success('Password updated successfully');
            setNewPassword('');
        } catch (error) {
            toast.error('Failed to update password');
        }
    };

    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Typography variant="body1" gutterBottom>
                Email: {email}
            </Typography>
            <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordUpdate}
                sx={{ mt: 2 }}
            >
                Update Password
            </Button>
        </Box>
    );
}

export default ProfilePage;
