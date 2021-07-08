import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
    const [username, setUsername] = useState('')
    const [token, setToken] = useState('')
    const [cookies, setCookie] = useCookies(['user'])

    // Cookie
    const handleCookie = () => {
        setCookie('username', username, {path: '/'})
        setCookie('token', token, {path: '/'})
    }

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
            setUsername(loginInfo.username)
            setToken(data.token)
            console.log(token)
            handleCookie()
            console.log(cookies.token) 
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
