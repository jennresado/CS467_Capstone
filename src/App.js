import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className='container'>
        <h1>Testing</h1>
        {/* Navigation Menu */}
        {/* Landing Page */}
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
