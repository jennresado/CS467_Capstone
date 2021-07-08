import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

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
                        cookies={cookies}
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
