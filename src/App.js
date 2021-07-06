import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'

function App() {
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
            path='/login' render={(props) => (
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
