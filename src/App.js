import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Navigation from './components/Navigation'
import Footer from './components/Footer';

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
        <Route path= '/Landing' component={Footer}/>
        <Route path= '/Landing' component={Navigation}/>
        <Route path= '/UserProfile' component={Navigation}/>
        <Route path= '/UserProfile' component={Footer}/>
      </div>
    </Router>
  );
}

export default App;
