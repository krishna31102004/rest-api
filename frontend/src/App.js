import React from 'react';
import './App.css';
import ProductList from './components/productList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Store</h1>
      </header>
      <ProductList />
    </div>
  );
}

export default App;
