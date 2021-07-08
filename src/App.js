import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
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
        {/* Navigation Menu compent prop added to each page */}
        {/* Landing Page */}
        
        <Route path= '/' component={Navigation}/>
        <Route path='/'
        exact
        render={(props) => (
          <>
          <Landing/>
          <Route path= '/' component={Footer}/>
          </>
        )}
        />
        <Route path= '/Landing' component={Landing}/>
        <Route path= '/Landing' component={Footer}/>
        <Route path= '/Landing' component={Navigation}/>
        {/* Sign Up Page */}
        <Route path= '/SignUp' component={SignUp}/>
        <Route path= '/SignUp' component={Footer}/>
        <Route path= '/SignUp' component={Navigation}/>
        {/* Login Page */}
        {/* Dashboard Page */}
        {/* Profile Settings Page */}
        <Route path= '/UserProfile' component={UserProfile}/>
        <Route path= '/UserProfile' component={Navigation}/>
        <Route path= '/UserProfile' component={Footer}/>
        {/* Add Animal Page */}
        {/* About Page */}
        <Route path= '/About' component={About}/>
        <Route path= '/About' component={Navigation}/>
        <Route path= '/About' component={Footer}/>
        {/* Contact Us Page */}
        <Route path= '/Contact' component={Contact}/>
        <Route path= '/Contact' component={Navigation}/>
        <Route path= '/Contact' component={Footer}/>
      </div>
    </Router>
  );
}

export default App;
