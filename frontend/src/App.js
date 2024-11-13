// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetails from './pages/ProductDetails';
import { AppBar, Toolbar, Typography, IconButton, Badge, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });
    const [cartOpen, setCartOpen] = useState(false);
    const [animateCart, setAnimateCart] = useState(false);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);
            if (existingItem) {
                toast.info(`Increased quantity for ${product.name}`);
                return prevItems.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                toast.success(`${product.name} added to cart`);
                return [...prevItems, { ...product, quantity }];
            }
        });

        setAnimateCart(true);
        setTimeout(() => setAnimateCart(false), 500);
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const item = prevItems.find((item) => item._id === productId);
            if (item.quantity > 1) {
                toast.info(`Decreased quantity for ${item.name}`);
                return prevItems.map((item) =>
                    item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                toast.error(`${item.name} removed from cart`);
                return prevItems.filter((item) => item._id !== productId);
            }
        });
    };

    const incrementQuantity = (productId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
        const item = cartItems.find((item) => item._id === productId);
        if (item) toast.info(`Increased quantity for ${item.name}`);
    };

    const decrementQuantity = (productId) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item._id === productId && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
        const item = cartItems.find((item) => item._id === productId);
        if (item && item.quantity > 1) toast.info(`Decreased quantity for ${item.name}`);
        if (item && item.quantity === 1) toast.error(`${item.name} removed from cart`);
    };

    const toggleCart = () => {
        setCartOpen(!cartOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success("Logged out successfully!");
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        toast.success("Checkout successful! Cart cleared.");
    };

    return (
        <Router>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align="center">
                            My Store
                        </Typography>
                        <Button color="inherit" component={Link} to="/profile">
                            Profile
                        </Button>
                        <Button color="inherit" onClick={handleLogout} component={Link} to="/login">
                            Logout
                        </Button>
                        <IconButton color="inherit" onClick={toggleCart}>
                            <Badge badgeContent={cartItems.reduce((sum, item) => sum + item.quantity, 0)} color="secondary">
                                <ShoppingCartIcon className={animateCart ? "cart-animated" : ""} />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Routes>
                    <Route path="/" element={<ProductList addToCart={addToCart} />} />
                    <Route path="/checkout" element={<CheckoutPage clearCart={clearCart} />} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                </Routes>

                <CartModal 
                    open={cartOpen} 
                    onClose={toggleCart} 
                    cartItems={cartItems} 
                    removeFromCart={removeFromCart} 
                    incrementQuantity={incrementQuantity} 
                    decrementQuantity={decrementQuantity} 
                />

                <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
            </div>
        </Router>
    );
}

export default App;
