import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import './App.css';
import Navigation from './pages/Navigation';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <Container>
        <Navigation />
        <Home />
      </Container>

    </div>

  );
}

export default App;
