import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sellers from './Sellers';
import Products from './Products';
import Orders from './Orders';
import LoginForm from './LoginForm';
import Reports from './Reports';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { AuthProvider, AuthContext } from './AuthContext';

function App() {
    const { isLoggedIn, handleLogout } = useContext(AuthContext);

    return (
        <Router>
            <div>
                {isLoggedIn && (
                    <Navbar bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand>MongoApp</Navbar.Brand>
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/sellers">Sellers</Nav.Link>
                                <Nav.Link as={Link} to="/products">Products</Nav.Link>
                                <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
                                <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                            </Nav>
                            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                        </Container>
                    </Navbar>
                )}
                <Container>
                    <Routes>
                    
                                <Route path="/sellers" element={<Sellers />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/reports" element={<Reports />} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default function AppWithProvider() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
