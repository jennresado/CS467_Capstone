import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom'
import Landing from './components/Landing'
import Navigation from './components/Navigation'
import Footer from './components/Footer';
import Contact from './components/Contact';
import UserProfile from './components/UserProfile';
import SignUp from './components/SignUp';
import About from './components/About'

function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    // removeCookie('user') //when a user logs out

    // Login User
    const loginUser = async (loginInfo) => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/auth/login`,
            {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(loginInfo)
            }
        )
        
        const data = await res.json()
        
        if ("token" in data) {
            // Create cookie
            setCookie(
                'user', 
                {'username': loginInfo.username, 'token': data.token}, 
                {path: '/'}
            )
        }
    }

    return (
        <Router>
        <div className='container'>
            {/* Navigation Bar */}
            <Navigation />
            
            {/* Landing Page */}
            <Route 
                path='/' exact render={(props) => (
                    <Landing />
                )}
            />

            {/* Sign Up Page */}
            <Route 
                path= '/signup' 
                render={(props) => (
                    <SignUp />
                )
            }/>

            {/* Login Page */}
            <Route 
                path='/login' 
                render={(props) => (
                    <Login 
                        onLogin={loginUser} 
                        cookies={cookies}
                    />
                )}
            />

            {/* Dashboard Page */}
            <Route 
                path= '/dashboard' 
                render={(props) => (
                    <Dashboard />
                )
            }/>

            {/* Profile Settings Page */}
            <Route 
                path= '/userprofile' 
                render={(props) => (
                    <UserProfile />
                )
            }/>

            {/* Add Animal Page */}
            {/* <Route 
                path= '/Animal' 
                render={(props) => (
                    <Animal />
                )
            }/> */}
            
            {/* About Page */}
            <Route 
                path= '/about' 
                render={(props) => (
                    <About />
                )
            }/>

            {/* Contact Us Page */}
            <Route 
                path= '/contact' 
                render={(props) => (
                    <Contact />
                )
            }/>

            {/* Footer */}
            <Footer />
        </div>
        </Router>
    );
}

export default App;
