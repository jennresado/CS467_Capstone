import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav } from 'react-bootstrap'
import { useLocation } from 'react-router-dom' 

// can change to <Nav.Item </Nav.Item> so the links are not 'blue'
//Footer is same for Landing, Login & SignUp
//User Profile Settings adds 'Dashboard', 'Profile' & 'Animal' 
const Footer = ({ cookies }) => {
    const location = useLocation()
    const loggedIn = Object.keys(cookies).length > 0 && Object.keys(cookies.user).length > 0 ? true : false 
    const admin = loggedIn && cookies.user.admin ? true : false 
    
    return (
        <div>
            <Navbar collapseOnSelect expand= 'sm'             
                bg='white' 
                variant='light'
                fixed='bottom'>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-center'>

                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>

                {location.pathname === '/userprofile' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                
                {location.pathname === '/' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/' && !loggedIn && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/' && !loggedIn && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/dashboard' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/dashboard' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/dashboard' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }

                {location.pathname === '/animal' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/animal' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/animal' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
    
                {location.pathname === '/signup' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/signup' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/login' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/login' && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                
                {location.pathname === '/about' && !loggedIn && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/about' && !loggedIn && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                {location.pathname === '/about' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/about' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }

                {location.pathname === '/contact' && !loggedIn && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/contact' && !loggedIn && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                {location.pathname === '/contact' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/contact' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }

                {location.pathname === '/userprofile' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/userprofile' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/userprofile' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Footer
