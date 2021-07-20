import { Link, useHistory } from 'react-router-dom'
import { useState } from 'react'
import { FaCameraRetro } from 'react-icons/fa'
import signupImg1 from '../assets/signupImg1.jpg'

const SignUp = ({ onSignup }) => {
    let history = useHistory()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [admin, setAdmin] = useState(false)
    const [errorUserName, setErrorUsername] = useState(false)
    const [errorInputBlank, setErrorInput] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        // blank input
        if (username == '' || password == '' || first_name == '' || last_name == '' || email == '') {
            setErrorInput(true)
            setTimeout(() => setErrorInput(false), 1000)
            clearTimeout();
            return
        }

        onSignup({ first_name, last_name, email, username, password, admin })
            .then(() => {
                history.push('/dashboard')
            }
            ).catch((err) => {
                setErrorUsername(true)
                setTimeout(() => setErrorUsername(false), 1000)
                setTimeout(() => setUsername(''), 1000)
                setTimeout(() => setUsername(''), 1000)
                setTimeout(() => setPassword(''), 1000)
                setTimeout(() => setFirstName(''), 1000)
                setTimeout(() => setLastName(''), 1000)
                setTimeout(() => setEmail(''), 1000)
                clearTimeout();
            }
            )
    }

    return (
        <div className='generalFormat'>
            <div className='row justify-content-center'>
                <div className='col-sm-10 col-md-6 col-lg-4'>
                    <div className='row'>
                        <h1>Sign Up</h1>
                    </div>
                    <div className='row'>
                        <form className='signupForm' onSubmit={onSubmit}>
                            {errorUserName && <p className='signupError'>This username is already taken.</p>}
                            {errorInputBlank && <p className='signupError'>Fields cannot be blank.</p>}
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
                            <div>
                                <input
                                    type='text'
                                    placeholder='first name'
                                    className='form-control'
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type='text'
                                    placeholder='last name'
                                    className='form-control'
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type='text'
                                    placeholder='email'
                                    className='form-control'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='d-grid gap-2 mx-auto'>
                                <button className='btn btn-primary' type='submit'>Sign Up</button>
                            </div>
                            <Link to="/login">Already have an acount? Log In</Link>
                        </form>
                    </div>
                    <div className='row'>
                        <img src={signupImg1} className='img-fluid rounded loginImg'></img>
                        <p className='imgCredit'>
                            <FaCameraRetro></FaCameraRetro> by <a href="https://unsplash.com/@krista?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Krista Mangulsone</a> on <a href="https://unsplash.com/s/photos/pets?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
