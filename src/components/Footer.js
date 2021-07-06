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
                {location.pathname === '/UserProfile' && <Nav.Link href="#Dashboard">Dashboard</Nav.Link> }
                <Nav.Link href="#Home">Home</Nav.Link> 
                <Nav.Link href="#About">About</Nav.Link>
                <Nav.Link href="#Contact">Contact</Nav.Link>
                {location.pathname === '/Landing' && <Nav.Link href="#Login">Login</Nav.Link> }
                {location.pathname === '/UserProfile' && <Nav.Link href="#Profile">Profile</Nav.Link> }
                {location.pathname === '/UserProfile' && <Nav.Link href="#Animal">Animal</Nav.Link> }
                {location.pathname === '/Landing' && <Nav.Link href="#SignUp">SignUp</Nav.Link> }
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Footer
