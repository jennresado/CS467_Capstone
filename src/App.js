import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'

function App() {
  return (
    <Router>
      <div className='container'>
        {/* Navigation Menu */}
        {/* Landing Page */}
        <Landing />
        {/* Sign Up Page */}
        {/* Login Page */}
        {/* Dashboard Page */}
        {/* Profile Settings Page */}
        {/* Add Animal Page */}
      </div>
    </Router>
  );
}

export default App;
