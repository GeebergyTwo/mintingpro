import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane, faBars, faHome, faInfoCircle, faReceipt, faSignOutAlt, faBolt, faUser, faMobileAlt, faSignal, faTv, faPlug, faArrowAltCircleDown, faMoneyBillWave, faLevelUpAlt, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import logo from '../gosubme_icon.png';

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 30) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    const isLogout = window.confirm('Do you want to log out?');
    
    if (isLogout) {
      try {
        // Assuming you stored the user info or token under 'auth' in localStorage
        localStorage.removeItem('auth');
        console.log('User logged out');
  
        // Redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  // Styles
  const sidebarStyle = {
    width: '250px',
    height: '100vh',
    backgroundColor: '#262A36',
    color: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    padding: '20px',
    overflowY: 'auto',
    display: 'none' // Initially hidden, displayed via media query
  };

  const activeLinkStyle = {
    backgroundColor: '#3C3F4C',
    color: '#6D00FF', // Text color for active link
    borderRadius: '4px', // Optional: Adds rounded corners
    fontWeight: 'bold',
  };

  const activeIconStyle = {
    color: '#6D00FF', // Icon color for active link
    marginRight: '8px',
  };

  const activeIconStyleTwo = {
    color: '#6D00FF', // Icon color for active link
  };

  const linkStyle = {
    color: '#fff', // Default text color
    textDecoration: 'none', // Removes underline
    padding: '10px 15px', // Adds padding for better click area
    display: 'flex',
    alignItems: 'center',
  };

  const offcanvasHeaderStyle = {
    backgroundColor: '#262A36', // Change to your desired header background color
    color: '#fff', // Change to your desired text color
  };

  const offcanvasBodyStyle = {
    backgroundColor: '#262A36', // Change to your desired body background color
    color: '#fff', // Change to your desired text color
  };

  const bottomNavigatorStyle = {
    zIndex: '2000',
    position: 'fixed',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#3B3E50',
    width: '100%',
    maxWidth: '300px', // Adjust the width as needed
    height: '60px',
    borderRadius: '30px', // Rounded edges
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0 10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)' // Optional: Adds shadow for better visibility
  };

  const middleButtonStyle = {
    backgroundColor: 'transparent', // Background color will be set by the gradient
    width: '70px', // Adjust size as needed
    height: '70px',
    borderRadius: '50%', // Circular shape
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to bottom, #6D00FF, #9F00FF)', // Gradient color
    boxShadow: '0 0 5px rgba(0,0,0,0.2)', // Optional: Adds shadow for better visibility
    transform: 'translateY(-30%)' // Makes the button appear to escape the border
  };

  const logoStyle = {
    width: '55px', // Adjust the width according to your needs
    height: 'auto', // Maintain aspect ratio
    marginRight: '10px' // Adjust spacing between logo and menu icon
  };
  
  const menuIconStyle = {
    backgroundColor: '#262A36',
    color: 'white',
    padding: '10px',
    borderRadius: '12px',
    fontSize: '24px', // Adjust size as needed
  };
  
  return (
    <div>
      {/* Navbar with toggle button */}
      <Navbar bg={scrolled ? "none" : "none"} variant="dark" expand="lg" className={`fixed-top ${location.pathname === '/login' || location.pathname === '/signup' ? 'd-none' : 'd-lg-none'}`}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleShow} style={{
          display: 'flex',
          alignItems: 'center',
          border: 'none',       // Remove any border
          outline: 'none',      // Remove any outline
          boxShadow: 'none',    // Remove any box shadow if present
        }}>
          <FontAwesomeIcon icon={faBars} style={menuIconStyle} />
        </Navbar.Toggle>
        <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'center' }}>
          {scrolled ? (
          <>
          {/* G<span style={{color: '#E7772F'}}>o</span> SUBME */}
          </>
          ):
          (
            <>
            {/* <img src={logo} alt='gosubme_logo' style={logoStyle} /> */}
            Minter<span style={{color: '#6D00FF'}}>Pro</span>
            </>
          )} 
        </Navbar.Brand>
      </Navbar>


      {/* Offcanvas for small screens */}
      <Offcanvas show={show} onHide={handleClose} placement="start" className={location.pathname === '/login' || location.pathname === '/signup' ? 'd-none' : 'd-lg-none'}>
        <Offcanvas.Header closeButton style={offcanvasHeaderStyle}>
          <Offcanvas.Title>Minter<span style={{color: '#6D00FF'}}>Pro</span></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={offcanvasBodyStyle}>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleClose} style={location.pathname === '/' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faHome} style={location.pathname === '/' ? activeIconStyle : { marginRight: 8 }} />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/mint" onClick={handleClose} style={location.pathname === '/mint' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faBolt} style={location.pathname === '/mint' ? activeIconStyle : { marginRight: 8 }} />
              Mint
            </Nav.Link>
            <Nav.Link as={Link} to="/withdraw" onClick={handleClose} style={location.pathname === '/withdraw' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faMoneyBillWave} style={location.pathname === '/withdraw' ? activeIconStyle : { marginRight: 8 }} />
              Withdraw
            </Nav.Link>
            <Nav.Link as={Link} to="/transfer" onClick={handleClose} style={location.pathname === '/transfer' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faPaperPlane} style={location.pathname === '/transfer' ? activeIconStyle : { marginRight: 8 }} />
              Send and Receive
            </Nav.Link>
            <Nav.Link as={Link} to="/upgrade" onClick={handleClose} style={location.pathname === '/upgrade' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faLevelUpAlt} style={location.pathname === '/upgrade' ? activeIconStyle : { marginRight: 8 }} />
              Upgrade Mint Power
            </Nav.Link>
            <Nav.Link as={Link} to="/transactions" onClick={handleClose} style={location.pathname === '/transactions' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faReceipt} style={location.pathname === '/transactions' ? activeIconStyle : { marginRight: 8 }} />
              Transaction History
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" onClick={handleClose} style={location.pathname === '/profile' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faUser} style={location.pathname === '/profile' ? activeIconStyle : { marginRight: 8 }} />
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/faqs" onClick={handleClose} style={location.pathname === '/faqs' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faQuestionCircle} style={location.pathname === '/faqs' ? activeIconStyle : { marginRight: 8 }} />
              FAQs
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleClose} style={location.pathname === '/about' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faInfoCircle} style={location.pathname === '/about' ? activeIconStyle : { marginRight: 8 }} />
              About
            </Nav.Link>
            <Nav.Link onClick={handleLogout} style={linkStyle}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 8 }} />
              Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Sidebar for large screens */}
      <div style={sidebarStyle} className={location.pathname === '/login' || location.pathname === '/signup' ? 'd-none' : 'd-none d-lg-block'}>
        <Navbar.Brand href="/" style={{ color: '#fff' }}>Minter<span style={{color: '#6D00FF'}}>Pro</span></Navbar.Brand>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/" style={location.pathname === '/' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
            <FontAwesomeIcon icon={faHome} style={location.pathname === '/' ? activeIconStyle : { marginRight: 8 }} />
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/mint" onClick={handleClose} style={location.pathname === '/mint' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faBolt} style={location.pathname === '/mint' ? activeIconStyle : { marginRight: 8 }} />
              Mint
            </Nav.Link>
            <Nav.Link as={Link} to="/withdraw" onClick={handleClose} style={location.pathname === '/withdraw' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faMoneyBillWave} style={location.pathname === '/withdraw' ? activeIconStyle : { marginRight: 8 }} />
              Withdraw
            </Nav.Link>
            <Nav.Link as={Link} to="/transfer" onClick={handleClose} style={location.pathname === '/transfer' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faPaperPlane} style={location.pathname === '/transfer' ? activeIconStyle : { marginRight: 8 }} />
              Send and Receive
            </Nav.Link>
            <Nav.Link as={Link} to="/upgrade" onClick={handleClose} style={location.pathname === '/upgrade' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faLevelUpAlt} style={location.pathname === '/upgrade' ? activeIconStyle : { marginRight: 8 }} />
              Upgrade Mint Power
            </Nav.Link>
          <Nav.Link as={Link} to="/transactions" onClick={handleClose} style={location.pathname === '/transactions' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
            <FontAwesomeIcon icon={faReceipt} style={location.pathname === '/transactions' ? activeIconStyle : { marginRight: 8 }} />
            Transaction History
          </Nav.Link>
          <Nav.Link as={Link} to="/profile" style={location.pathname === '/profile' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
            <FontAwesomeIcon icon={faUser} style={location.pathname === '/profile' ? activeIconStyle : { marginRight: 8 }} />
            Profile
          </Nav.Link>
          <Nav.Link as={Link} to="/faqs" onClick={handleClose} style={location.pathname === '/faqs' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
              <FontAwesomeIcon icon={faQuestionCircle} style={location.pathname === '/faqs' ? activeIconStyle : { marginRight: 8 }} />
              FAQs
          </Nav.Link>
          <Nav.Link as={Link} to="/about" style={location.pathname === '/about' ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>
            <FontAwesomeIcon icon={faInfoCircle} style={location.pathname === '/about' ? activeIconStyle : { marginRight: 8 }} />
            About
          </Nav.Link>
          <Nav.Link onClick={handleLogout} style={linkStyle}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 8 }} />
            Logout
          </Nav.Link>
        </Nav>
      </div>

      {/* Bottom navigator */}
      <div className={location.pathname === '/login' || location.pathname === '/signup' ? 'd-none' : ''} style={bottomNavigatorStyle}>
        <Nav className="flex-row align-items-center justify-content-around" style={{ width: '100%' }}>
          <Nav.Link as={Link} to="/" style={linkStyle}>
            <FontAwesomeIcon icon={faHome} style={location.pathname === '/' ? activeIconStyleTwo : {}} />
          </Nav.Link>
          <Nav.Link as={Link} to="/mint" style={middleButtonStyle}>
            <FontAwesomeIcon icon={faBolt} style={{ color: '#fff', fontSize: '24px' }} /> {/* Adjust fontSize as needed */}
          </Nav.Link>
          <Nav.Link as={Link} to="/profile" style={linkStyle}>
            <FontAwesomeIcon icon={faUser} style={location.pathname === '/profile' ? activeIconStyleTwo : {}} />
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
