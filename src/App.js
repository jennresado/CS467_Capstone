import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
    const [cookies, setCookie] = useCookies(['user'])



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
            console.log(data)
            setCookie('username', loginInfo.username, {path: '/'})
            console.log(cookies.username)
            // history.push('/dashboard')
            // setUsername(loginInfo.username)
            // setToken(data.token)
            // console.log(token)
            // handleCookie()
            // console.log(cookies.token) 
        }
    }

    return (
        <Router>
        <div className='container'>
            {/* Navigation Menu */}
            <Route 
                path='/' exact render={(props) => (
                    <Landing />
                )}
            />
            {/* Sign Up Page */}
            <Route 
                path='/login' 
                render={(props) => (
                    <Login 
                        onLogin={loginUser} 
                    />
                )}
            />
            {/* Dashboard Page */}
            <Route path='/dashboard' component={Dashboard} />
            {/* Profile Settings Page */}
            {/* Add Animal Page */}
        </div>
        </Router>
    );
}

export default App;
