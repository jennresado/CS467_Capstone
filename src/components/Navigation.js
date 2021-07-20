import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav } from 'react-bootstrap'
import { useLocation } from 'react-router-dom' 

 // can change to <Nav.Item </Nav.Item> so the links are not 'blue'

 //Landing page does not show Dashboard Nav Link 

 const Navigation = ({ onLogout, cookies }) => {
    const location = useLocation()
    const loggedIn = Object.keys(cookies).length > 0 && Object.keys(cookies.user).length > 0 ? true : false 
    const admin = loggedIn && cookies.user.admin ? true : false 

    return (
         <div className='navBrand'> 
            <Navbar collapseOnSelect expand= 'sm'
                bg='white' 
                variant='light'
                fixed='top'>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    {location.pathname === '/userprofile' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                    {location.pathname === '/userprofile' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                    {location.pathname === '/userprofile' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }

                    {location.pathname === '/animal' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                    {location.pathname === '/animal' && admin &&  <Nav.Link href="/animal">Animal</Nav.Link> }
                    {location.pathname === '/animal' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }

                    {location.pathname === '/dashboard' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                    {location.pathname === '/dashboard' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                    {location.pathname === '/dashboard' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }

                    {location.pathname === '/' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                    {location.pathname === '/' && admin &&  <Nav.Link href="/animal">Animal</Nav.Link> }
                    {location.pathname === '/' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                    {location.pathname === '/' && !loggedIn && <Nav.Link href="/login">Login</Nav.Link> }
                    {location.pathname === '/' && !loggedIn && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                    {location.pathname === '/login' && <Nav.Link href="/login">Login</Nav.Link> }
                    {location.pathname === '/login' && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                    {location.pathname === '/contact' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                    {location.pathname === '/contact' && admin &&  <Nav.Link href="/animal">Animal</Nav.Link> }
                    {location.pathname === '/contact' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }

                    {location.pathname === '/contact' && !loggedIn && <Nav.Link href="/login">Login</Nav.Link> }
                    {location.pathname === '/contact' && !loggedIn && <Nav.Link href="/signup">Sign Up</Nav.Link> }

                    {location.pathname === '/signup' && <Nav.Link href="/login">Login</Nav.Link> }
                    {location.pathname === '/signup' && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                    
                    {location.pathname === '/about' && loggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link> }
                    {location.pathname === '/about' && admin && <Nav.Link href="/animal">Animal</Nav.Link> }
                    {location.pathname === '/about' && loggedIn && <Nav.Link href="/userprofile">Profile</Nav.Link> }
                    {location.pathname === '/about' && !loggedIn && <Nav.Link href="/login">Login</Nav.Link> }
                    {location.pathname === '/about' && !loggedIn && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                
                    {loggedIn && <Nav.Link href="/" onClick={() => onLogout()}>Logout</Nav.Link>}
                </Navbar.Collapse>
            </Navbar>
            <div className='navContent'> </div>
        </div>
     
     )
 }
 
 export default Navigation
