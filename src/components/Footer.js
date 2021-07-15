import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav } from 'react-bootstrap'
import { useLocation } from 'react-router-dom' 

// can change to <Nav.Item </Nav.Item> so the links are not 'blue'
//Footer is same for Landing, Login & SignUp
//User Profile Settings adds 'Dashboard', 'Profile' & 'Animal' 
const Footer = () => {
    const location = useLocation()
    return (
        <div>
            <Navbar collapseOnSelect expand= 'sm'             
                bg='white' 
                variant='light'
                fixed='bottom'>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-center'>

                {location.pathname === '/userprofile' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }

                {location.pathname === '/dashboard' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/dashboard' && <Nav.Link href="/dashboard">Home</Nav.Link> }

                {location.pathname === '/animal' && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/animal' && <Nav.Link href="/dashboard">Home</Nav.Link> }

                {location.pathname === '/' && <Nav.Link href="/">Home</Nav.Link> }

                {location.pathname === '/login' && <Nav.Link href="/">Home</Nav.Link> }
                
                {location.pathname === '/about' && <Nav.Link href="/">Home</Nav.Link> }

                {location.pathname === '/signup' && <Nav.Link href="/">Home</Nav.Link> }

                {location.pathname === '/contact' && <Nav.Link href="/">Home</Nav.Link> }

                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>

                {location.pathname === '/' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/signup' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/signup' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/login' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/login' && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                
                {location.pathname === '/about' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/about' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/contact' && <Nav.Link href="/login">Login</Nav.Link> }
                {location.pathname === '/contact' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/userprofile' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/userprofile' && <Nav.Link href="/animal">Animal</Nav.Link> }
                {location.pathname === '/userprofile' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                {location.pathname === '/dashboard' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/dashboard' && <Nav.Link href="/animal">Animal</Nav.Link> }

                {location.pathname === '/animal' && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                {location.pathname === '/animal' && <Nav.Link href="/animal">Animal</Nav.Link> }
                
                
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Footer
