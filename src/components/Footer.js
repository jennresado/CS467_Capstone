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
                {location.pathname === '/UserProfile' && <Nav.Link href="/Dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/Dashboard' && <Nav.Link href="/Dashboard">Home</Nav.Link> }
                {location.pathname === '/' && <Nav.Link href="/">Home</Nav.Link> }
                {location.pathname === '/About' && <Nav.Link href="/">Home</Nav.Link> }
                {location.pathname === '/SignUp' && <Nav.Link href="/">Home</Nav.Link> }
                {location.pathname === '/Contact' && <Nav.Link href="/">Home</Nav.Link> }
                <Nav.Link href="/About">About</Nav.Link>
                <Nav.Link href="/Contact">Contact</Nav.Link>
                {location.pathname === '/' && <Nav.Link href="/Login">Login</Nav.Link> }
                {location.pathname === '/SignUp' && <Nav.Link href="/Login">Login</Nav.Link> }
                {location.pathname === '/Contact' && <Nav.Link href="/Login">Login</Nav.Link> }
                {location.pathname === '/UserProfile' && <Nav.Link href="/UserProfile">Profile</Nav.Link> }
                {location.pathname === '/UserProfile' && <Nav.Link href="/Animal">Animal</Nav.Link> }
                {location.pathname === '/Landing' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                {location.pathname === '/Contact' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                {location.pathname === '/SignUp' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                {location.pathname === '/' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                {location.pathname === '/UserProfile' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Footer
