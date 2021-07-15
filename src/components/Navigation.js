import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav } from 'react-bootstrap'
import { useLocation } from 'react-router-dom' 

 // can change to <Nav.Item </Nav.Item> so the links are not 'blue'

 //Landing page does not show Dashboard Nav Link 

 const Navigation = ({ onLogout }) => {
    const location = useLocation()

    return (
         <div className='navBrand'> 
            <Navbar collapseOnSelect expand= 'sm'
                bg='white' 
                variant='light'
                fixed='top'>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                {location.pathname === '/userprofile' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/userprofile' && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/userprofile' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/userprofile' && <Nav.Link href="/" onClick={() => onLogout()}>Logout</Nav.Link>}

                {location.pathname === '/animal' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/animal' && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/animal' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/animal' && <Nav.Link href="/" onClick={() => onLogout()}>Logout</Nav.Link>}

                {location.pathname === '/dashboard' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/dashboard' && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/dashboard' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/dashboard' && <Nav.Link href="/" onClick={() => onLogout()}>Logout</Nav.Link>}

                {location.pathname === '/' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/login' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/login' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/contact' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/contact' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/signup' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/signup' && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                
                {location.pathname === '/about' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/about' && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                
              
                </Navbar.Collapse>
            </Navbar>
            <div className='navContent'> </div>
        </div>
     
     )
 }
 
 export default Navigation
