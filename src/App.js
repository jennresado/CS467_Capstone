import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
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
    const [animals, setAnimals] = useState([])
    const [users, setUsers] = useState([])

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

    // Retrieve animals from db
    useEffect(() => {
        if (cookies.user) {
            console.log("retrieving animals")
            getAnimals(cookies.user.token)
        }
    }, [])


    // Retrieve users from db
    useEffect(() => {
        const getUsers = async () => {
            const res = await fetch(
                `https://bring-me-home-backend.herokuapp.com/users/`,
                {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': cookies.user.token
                    }
                }
            )

            if (res.ok) {
                const data = await res.json()
                //console.log('Got user')
                setUsers(data.user)
            }
        }

        if (cookies.user) {
            getUsers()
        }
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
            // Retrieve animals from db
            getAnimals(data.token)
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
                { 'username': signUpInfo.username, 'token': data.token, 'admin': data.admin},
                { path: '/' }
            )
            // Retrieve animals from db
            getAnimals(data.token)
        } else {
            throw new Error('Invalid Registration')
        }
    }

    // Authenticate user for non-public pages
    const requireAuth = () => {
        if (!cookies.user) {
            return false
        }
        return true
    }

    // Authenticate user for admin page
    const requireAuthAdmin = () => {
        if (!cookies.user) {
            return false
        } else if (!cookies.user.admin) {
            return false
        }
        return true
    }

    // Add new animal
    const addAnimal = async (body) => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/animals/`,
            {
                method: 'POST',
                headers: { 
                    'Content-type': 'application/json',
                    'Authorization': cookies.user.token 
                },
                body: JSON.stringify(body)
            }
        )

        if (res.ok) {
            getAnimals(cookies.user.token)
        } else {
            throw new Error('Cannot add animal')
        }
    }

    // Update existing animal
    const updateAnimal = async (body) => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/animals/` + body.animal_id,
            {
                method: 'PUT',
                headers: { 
                    'Content-type': 'application/json',
                    'Authorization': cookies.user.token 
                },
                body: JSON.stringify(body)
            }
        )

        if (res.ok) {
            getAnimals(cookies.user.token)
        } else {
            throw new Error('Cannot update animal')
        }
    }

    // Delete existing animal
    const deleteAnimal = async (animal_id) => {
        const res = await fetch (
            `https://bring-me-home-backend.herokuapp.com/animals/` + animal_id,
            {
                method: 'DELETE',
                headers: { 
                    'Content-type': 'application/json',
                    'Authorization': cookies.user.token
                }
            }
        )

        if (res.ok) {
            getAnimals(cookies.user.token)
        } else {
            throw new Error('Cannot delete animal')
        }
    }

    // Retrieve animals from db
    const getAnimals = async (token) => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/animals`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': token
                }
            }
        )

        if (res.ok) {
            const data = await res.json()

            setAnimals(data.animals)
        }
    }

    // Update existing user
    const updateUser = async (body) => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/users/`,
            {
                method: 'PUT',
                headers: { 'Content-type': 'application/json',
                'Authorization': cookies.user.token },
                body: JSON.stringify(body)
            }
        )

        if (res.ok) {
            //console.log("User updated")
        } else {
            throw new Error('Cannot update user')
        }
    }

    // Delete existing user
    const deleteUser = async () => {
        const res = await fetch(
            `https://bring-me-home-backend.herokuapp.com/users/`,
            {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json',
                'Authorization': cookies.user.token
            }
                
            }
        )

        if (res.ok) {
            //console.log("User deleted")
        } else {
            throw new Error('Cannot delete user')
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
                    path='/signup'
                    render={(props) => (
                        <SignUp
                            onSignup={signUpUser}
                        />
                    )
                    } />

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
                <Route
                    path='/dashboard'
                    render={(props) => (
                        requireAuth() ?
                            <Dashboard
                                animalsDb={animals}
                            /> :
                            <Redirect to='/' />
                    )
                    } />

                {/* Profile Settings Page */}
                <Route
                    path='/userprofile'
                    render={(props) => (
                        <UserProfile
                            usersDb={users}
                            onUpdateUser={updateUser}
                            onDeleteUser={deleteUser} />
                    )
                    } />

                {/* Animal Page */}
                <Route
                    path='/Animal'
                    render={(props) => (
                        requireAuthAdmin() ?
                            <Animal
                                animalsDb={animals}
                                onAddAnimal={addAnimal}
                                onUpdateAnimal={updateAnimal}
                                onDeleteAnimal={deleteAnimal}
                            /> :
                            <Redirect to='/' />
                    )
                    } />

                {/* About Page */}
                <Route
                    path='/about'
                    render={(props) => (
                        <About />
                    )
                    } />

                {/* Contact Us Page */}
                <Route
                    path='/contact'
                    render={(props) => (
                        <Contact />
                    )
                    } />

                {/* Footer */}
                <Footer 
                    cookies={cookies}
                />
            </div>
        </Router>
    );
}

export default App;
