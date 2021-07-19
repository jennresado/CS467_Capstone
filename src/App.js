import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Navigation from './components/Navigation'
import Footer from './components/Footer';
import Contact from './components/Contact';
import UserProfile from './components/UserProfile';
import SignUp from './components/SignUp';
import About from './components/About'
import Animal from './components/Animal'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    // Warm up backend server to decrease latency
    useEffect(() => {
        const warmServer = async () => {
            const res = await fetch(
                `https://bring-me-home-backend.herokuapp.com/`,
                {
                    method: 'GET',
                    headers: {'Content-type': 'application/json'}
                }
            )
    
            if (res.ok) {
                console.log('hello world')
            }
        }

        warmServer()
    }, [])

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

        if (res.ok) {
            const data = await res.json()
        
            // Create cookie
            setCookie(
                'user', 
                {'username': loginInfo.username, 'token': data.token, 'admin': data.admin}, 
                {path: '/'}
            )
            console.log(data)
            console.log(cookies.user)
        } else {
            throw new Error('Invalid login')
        }  
    }

    // Logout User
    const logoutUser = async () => {
        removeCookie('user', {'path': '/'})
    }

    // Sign Up New User
    const signUpUser = async (signUpInfo) => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/auth/register`,
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(signUpInfo)
            }
        )
        
        if (res.ok) {
            const data = await res.json()
            // Create cookie
            setCookie(
                    'user',
                    { 'username': signUpInfo.username, 'token': data.token },
                    { path: '/' }
            )
        } else {
            throw new Error('Invalid Registration')
        }
    }

    return (
        <Router>
        <div className='container'>
            {/* Navigation Bar */}
            <Navigation 
                onLogout={logoutUser}
                cookies={cookies}
            />
            
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
                    <SignUp 
                    onSignup={signUpUser}
                    />
                )
            }/>

            {/* Login Page */}
            <Route 
                path='/login' 
                render={(props) => (
                    <Login 
                        onLogin={loginUser} 
                    />
                )}
            />

            {/* Dashboard Page */}
            {/* {
                Object.keys(cookies).length > 0 && Object.keys(cookies.user).length > 0 ?
                <Route 
                    path= '/dashboard' 
                    render={(props) => (
                        <Dashboard />
                    )
                }/> :
                <Route 
                    path='/' exact render={(props) => (
                        <Landing />
                    )}
                />
            } */}

            <Route 
                path= '/dashboard' 
                render={(props) => (
                    <Dashboard />
                )
            }/>

            {/* Profile Settings Page */}
            {/* {
                Object.keys(cookies).length > 0 && Object.keys(cookies.user).length > 0 ?
                <Route 
                    path= '/userprofile' 
                    render={(props) => (
                        <UserProfile />
                    )
                }/> :
                <Redirect push to="/" />
            } */}

            <Route 
                path= '/userprofile' 
                render={(props) => (
                    <UserProfile />
                )
            }/>

            {/* Animal Page */}
            {/* {
                Object.keys(cookies).length > 0 && Object.keys(cookies.user).length > 0 && cookies.users.admin ?
                <Route 
                    path= '/Animal' 
                    render={(props) => (
                        <Animal />
                    )
                }/> :
                <Redirect push to="/" />
            } */}

            <Route 
                path= '/Animal' 
                render={(props) => (
                    <Animal />
                )
            }/>

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
            <Footer 
                cookies={cookies}
            />
        </div>
        </Router>
    );
}

export default App;
