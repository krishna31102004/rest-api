import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [animateCart, setAnimateCart] = useState(false);

    // Load cart items from local storage on component mount
    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    // Save cart items to local storage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });

        // Trigger cart animation
        setAnimateCart(true);
        setTimeout(() => setAnimateCart(false), 500);
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const item = prevItems.find((item) => item._id === productId);
            if (item.quantity > 1) {
                return prevItems.map((item) =>
                    item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                return prevItems.filter((item) => item._id !== productId);
            }
        });
    };

    const toggleCart = () => {
        setCartOpen(!cartOpen);
    };

    return (
        <Router>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align="center">
                            My Store
                        </Typography>
                        <IconButton color="inherit" onClick={toggleCart}>
                            <Badge badgeContent={cartItems.reduce((sum, item) => sum + item.quantity, 0)} color="secondary">
                                <ShoppingCartIcon className={animateCart ? "cart-animated" : ""} />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Routes>
                    <Route path="/" element={<ProductList addToCart={addToCart} />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                </Routes>

                <CartModal open={cartOpen} onClose={toggleCart} cartItems={cartItems} removeFromCart={removeFromCart} />
            </div>
        </Router>
    );
}

export default App;
