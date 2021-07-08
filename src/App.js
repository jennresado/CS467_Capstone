import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'

function App() {
    // Login User
    const loginUser = async (loginInfo) => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/`,
            {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(loginInfo)
            }
        )
        
        if (!res.ok) {
            throw new Error(res.status);
        }
        
        const data = await res.json()

        return data
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
                onLogin={loginUser}
                render={(props) => (
                    <Login />
                )}
            />
            {/* Dashboard Page */}
            {/* Profile Settings Page */}
            {/* Add Animal Page */}
        </div>
        </Router>
    );
}

export default App;
