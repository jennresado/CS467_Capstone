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
                path= '/SignUp' 
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
                path= '/Dashboard' 
                render={(props) => (
                    <Dashboard />
                )
            }/>

            {/* Profile Settings Page */}
            <Route 
                path= '/UserProfile' 
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
                path= '/About' 
                render={(props) => (
                    <About />
                )
            }/>

            {/* Contact Us Page */}
            <Route 
                path= '/Contact' 
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
