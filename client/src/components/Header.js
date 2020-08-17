import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AuthContext } from '../context/Context'
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  const authContext = useContext(AuthContext);

  const loginIcon = <svg className="bi bi-people-circle" width="25" height="25" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
    <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd" />
  </svg>

  return (
    <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
      <Navbar.Brand href="browse">
        Rent-O-Matic
      </Navbar.Brand>

      <Nav className="mr-auto">
        <Nav.Link as={NavLink} to="/browse">Browse</Nav.Link>
        <Nav.Link as={NavLink} to="/config"> Rent a vehicle</Nav.Link>
        <Nav.Link as={NavLink} to="/bookings"> Bookings</Nav.Link>
      </Nav>

      <Nav className="ml-md-auto">
        {authContext.authUser &&
          <>
            <Navbar.Brand>Welcome {authContext.authUser.username}!</Navbar.Brand>
            <Nav.Link onClick={() => { authContext.logout() }}>Logout</Nav.Link>
          </>}
        {!authContext.authUser && <Nav.Link as={NavLink} to="/login">{loginIcon}</Nav.Link>}
        <Nav.Link href="#">

        </Nav.Link>
      </Nav>
    </Navbar>);
}

export default Header;
