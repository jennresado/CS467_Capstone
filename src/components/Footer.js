import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div>
            <Navbar collapseOnSelect expand= 'sm'             
                bg='white' 
                variant='light'
                fixed='bottom'>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-center'>
                <Nav.Link href="#Home">Home</Nav.Link>
                <Nav.Link href="#About">About</Nav.Link>
                <Nav.Link href="#Contact">Contact</Nav.Link>
                <Nav.Link href="#Login">Login</Nav.Link>
                <Nav.Link href="#SignUp">SignUp</Nav.Link>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Footer
