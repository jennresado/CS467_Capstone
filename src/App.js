import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
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
                {path: '/', expires: 0}
            )
        }
    }

    return (
        <Router>
        <div className='container'>
            {/* Landing Page */}
            <Route 
                path='/' exact render={(props) => (
                    <>
                    <Navigation />
                    <Landing />
                    
                    </>
                )}
            />

            {/* Sign Up Page */}
            <Route 
                path= '/SignUp' 
                render={(props) => (
                    <>
                        <Navigation />
                        <SignUp />
                        <Footer />
                    </>

                )
            }/>

            {/* Login Page */}
            <Route 
                path='/login' 
                render={(props) => (
                    <>
                        <Navigation />
                        <Login 
                            onLogin={loginUser} 
                            cookies={cookies}
                        />
                        <Footer />
                    </>
                )}
            />

            {/* Dashboard Page */}
            <Route 
                path= '/Dashboard' 
                render={(props) => (
                    <>
                        <Navigation />
                        <Dashboard />
                        <Footer />
                    </>

                )
            }/>

            {/* Profile Settings Page */}
            <Route 
                path= '/UserProfile' 
                render={(props) => (
                    <>
                        <Navigation />
                        <UserProfile />
                        <Footer />
                    </>

                )
            }/>

            {/* Add Animal Page */}
            {/* <Route 
                path= '/Animal' 
                render={(props) => (
                    <>
                        <Navigation />
                        <Animal />
                        <Footer />
                    </>

                )
            }/> */}
            
            {/* About Page */}
            <Route 
                path= '/About' 
                render={(props) => (
                    <>
                        <Navigation />
                        <About />
                        <Footer />
                    </>

                )
            }/>

            {/* Contact Us Page */}
            <Route 
                path= '/Contact' 
                render={(props) => (
                    <>
                        <Navigation />
                        <Contact />
                        <Footer />
                    </>

                )
            }/>

        </div>
        </Router>
    );
}

export default App;
