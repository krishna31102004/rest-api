// src/pages/CheckoutPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load cart items from local storage
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    const handlePayment = () => {
        // Clear cart from local storage after payment
        localStorage.removeItem('cartItems');
        alert('Payment successful! Thank you for your purchase.');
        navigate('/confirmation'); // Redirect to Order Confirmation page
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>
            <Typography variant="body1" gutterBottom>
                Review your items before payment.
            </Typography>

            <List>
                {cartItems.map((item, index) => (
                    <ListItem key={index} divider>
                        <ListItemText
                            primary={`${item.name} (Quantity: ${item.quantity})`}
                            secondary={`Price: $${item.price}`}
                        />
                    </ListItem>
                ))}
            </List>

            <Typography variant="h6" sx={{ marginTop: '20px' }}>
                Total Price: ${calculateTotalPrice()}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                sx={{ marginTop: '20px' }}
            >
                Pay Now
            </Button>
        </Box>
    );
}

export default CheckoutPage;
