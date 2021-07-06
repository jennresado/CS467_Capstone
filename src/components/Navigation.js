import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav } from 'react-bootstrap'
import { useLocation } from 'react-router-dom' 

 // can change to <Nav.Item </Nav.Item> so the links are not 'blue'

 //Landing page does not show Dashboard Nav Link 

 const Navigation = () => {
    const location = useLocation()
    return (
         <div className='navBrand'> 
            <Navbar collapseOnSelect expand= 'sm'
                bg='white' 
                variant='light'
                fixed='top'>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                {location.pathname === '/UserProfile' && <Nav.Link href="#Dashboard">Dashboard</Nav.Link> }
                {location.pathname === '/UserProfile' && <Nav.Link href="#Animal">Animal</Nav.Link> }
                {location.pathname === '/UserProfile' && <Nav.Link href="/UserProfile">Profile</Nav.Link> }
                {location.pathname === '/' && <Nav.Link href="#Login">Login</Nav.Link> }
                {location.pathname === '/Landing' && <Nav.Link href="#Login">Login</Nav.Link> }
                {location.pathname === '/Contact' && <Nav.Link href="#Login">Login</Nav.Link> }
                {location.pathname === '/SignUp' && <Nav.Link href="#Login">Login</Nav.Link> }
                
                {location.pathname === '/UserProfile' && <Nav.Link href="#Logout">Logout</Nav.Link> }
                {location.pathname === '/Landing' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                {location.pathname === '/Contact' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                {location.pathname === '/' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                {location.pathname === '/SignUp' && <Nav.Link href="/SignUp">Sign Up</Nav.Link> }
                </Navbar.Collapse>
            </Navbar>
            <div className='navContent'> </div>
        </div>
     )
 }
 
 export default Navigation