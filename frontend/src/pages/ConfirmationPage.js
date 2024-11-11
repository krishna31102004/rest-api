// src/pages/ConfirmationPage.js
import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ConfirmationPage() {
    const navigate = useNavigate();

    useEffect(() => {
        toast.info("Thank you for your purchase!"); // Notification on page load
    }, []);

    const handleBackToStore = () => {
        navigate('/');
    };

    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Order Confirmed!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Thank you for your purchase. Your order has been successfully placed.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBackToStore}
                sx={{ marginTop: '20px' }}
            >
                Back to Store
            </Button>
        </Box>
    );
}

export default ConfirmationPage;
