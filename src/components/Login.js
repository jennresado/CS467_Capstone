import { Link, Redirect, useHistory } from 'react-router-dom'
import { useState } from 'react'
import { FaCameraRetro } from 'react-icons/fa'
import loginImg1 from '../assets/login_1.jpg'

const Login = ({ onLogin, cookies }) => {
    let history = useHistory()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        if(!username && !password) {
            return
        }

        onLogin({ username, password })

        console.log(cookies.user)
        if (!cookies.user) {
            setError(true)
            setUsername('')
            setPassword('')
        } else {
            history.push('/Dashboard')
        }
    }

    return (
        <div className='generalFormat'>
            <div className='row justify-content-center'>
                <div className='col-sm-10 col-md-6 col-lg-4'>
                    <div className='row'>
                        <h1>Login</h1>
                    </div>
                    <div className='row'>
                        <form className='loginForm' onSubmit={onSubmit}>
                            {error && <p className='loginError'>Incorrect username/password.</p>}
                            <div>
                            <input 
                                    type='text'
                                    placeholder='username'
                                    className='form-control'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                            />
                            </div>
                            <div>
                                <input 
                                    type='text'
                                    placeholder='password'
                                    className='form-control'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                            />
                            </div>
                            <div className='d-grid gap-2 mx-auto'>
                                <button className='btn btn-primary' type='submit'>Login</button>
                            </div>
                            <Link to="/SignUp">Sign Up</Link>
                        </form>
                    </div>
                    <div className='row'>
                        <img src={loginImg1} className='img-fluid rounded loginImg'></img>
                        <p className='imgCredit'>
                            <FaCameraRetro></FaCameraRetro> by <a href="https://unsplash.com/@mnelson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Nelson</a> on <a href="https://unsplash.com/s/photos/husky?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
