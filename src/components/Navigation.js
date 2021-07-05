import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav } from 'react-bootstrap'


 
 const Navigation = () => {
     return (
         <div className='navBrand'> 
            <Navbar collapseOnSelect expand= 'sm'
                bg='white' 
                variant='light'
                fixed='top'>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                <Nav.Link href="#Login">Login</Nav.Link>
                <Nav.Link href="#SignUp">SignUp</Nav.Link>
                </Navbar.Collapse>
            </Navbar>
            <div className='navContent'> </div>
        </div>
     )
 }
 
 export default Navigation
 