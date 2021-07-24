import { useHistory } from 'react-router-dom'
import { useState } from 'react'

const UserProfile = ({ usersDb, onUpdateUser, onDeleteUser }) => {
    let history = useHistory()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [admin, setAdmin] = useState(false)
    const [showEditFields, setShowEditShowFields] = useState(false) 
    const [showEditButton, setShowEditButton] = useState(true) 
    const [showEditPassword, setShowEditPassword] = useState(false)  
    const [showEditPasswordButton, setShowEditPasswordButton] = useState(true)  
    const [errorUserName, setErrorUsername] = useState(false)
    const [errorInputBlank, setErrorInput] = useState(false)

    for (let i = 0; i < usersDb.length; i++) {
        var displayUsername = usersDb[i].username
        var displayPassword = usersDb[i].password
        var displayFirstName = usersDb[i].first_name
        var displayLastName = usersDb[i].last_name
        var displayEmail = usersDb[i].email
    }

    const buttonEdit = showEditButton
    const show = showEditFields
    const passsWordField  = showEditPassword
    const editPassButton = showEditPasswordButton

    const onEdit = (e) => {
        e.preventDefault()
        // fill the fields with existing user info
        setUsername(displayUsername)
        setPassword(displayPassword)
        setFirstName(displayFirstName)
        setLastName(displayLastName)
        setEmail(displayEmail)
        // display fields for editing user info
        setShowEditShowFields(true)
        // hide the original button
        setShowEditButton(false)
    }

    // password is encrypted, don't want to show that to user 
    // if they really want to change their password this clears the 
    // field before they edit password
    const onChangePassword = (e) => {
        e.preventDefault()
        // set password blank for user to change
        setPassword('')
        // display password edit field
        setShowEditPassword(true)
        // hide edit password button
        setShowEditPasswordButton(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        // handle blank input
        if (username == '' || password == '' || first_name == '' || last_name == '' || email == '') {
            setErrorInput(true)
            setTimeout(() => setErrorInput(false), 1000)
            clearTimeout();
            return
        }

        const body = {
            "username": username,
            'password': password,
            "first_name": first_name,
            "last_name": last_name,
            "email": email
        }
        console.log(body)

        onUpdateUser(body)
            .then(() => {
                history.push('/dashboard')
           }
            ).catch((err) => {
               setErrorUsername(true)
                setTimeout(() => setErrorUsername(false), 1000)
                setTimeout(() => setUsername(''), 1000)
                clearTimeout();
            }
            )
    }

    // on click cancel
    const onCancel = (e) => {
        e.preventDefault()
        history.push('/dashboard')
    }

    // on click delete
    const onDelete = (e) => {
        e.preventDefault()

        onDeleteUser()
            .then(() => {
                history.push('/')
            }).catch((err) => {
            })
    }

    return (
        <div className='generalFormat'>
            <div className='row justify-content-center'>
                <div className='col-sm-10 col-md-6 col-lg-4'>
                    <div className='row'>
                        <h1>Profile Settings</h1>
                    </div>
                    <div className='row'>
                        <form className='userProfileForm'>
                            <div className="card-body">                    
                                <p><strong>Username</strong>: {displayUsername}</p>
                                <p><strong>Password</strong>: ***********</p>
                                <p><strong>First Name</strong>: {displayFirstName}</p>
                                <p><strong>Last Name</strong>: {displayLastName}</p>
                                <p><strong>Email</strong>: {displayEmail}</p>
                            </div>
                            {errorUserName && <p className='userProfileError'>This username is already taken.</p>}
                            {errorInputBlank && <p className='userProfileError'>Fields cannot be blank.</p>}
                                <div className="col d-grid gap-2 mx-auto"> 
                                {
                                    show && <p><strong>DO NOT EDIT USERNAME WHEN TESTING</strong></p> 
                                }
                                {
                                    show &&
                                    <input
                                    type='text'
                                    placeholder='username'
                                    className='form-control'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    />
                                }
                            </div>
                            <div>
                                {
                                    show && editPassButton &&
                                    <div className="col d-grid gap-2 mx-auto">
                                    <button className='btn btn-warning' type='submit' onClick={onChangePassword}>Change Password</button>
                                    </div>
                                }
                            </div>
                            <div>
                                {
                                    passsWordField &&
                                    <input
                                    type='text'
                                    placeholder='password'
                                    className='form-control'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                }

                            </div>
                            <div>
                                {
                                    show &&
                                    <input
                                    type='text'
                                    placeholder='first name'
                                    className='form-control'
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                }

                            </div>
                            <div>
                                {
                                    show &&
                                    <input
                                    type='text'
                                    placeholder='last name'
                                    className='form-control'

                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                }

                            </div>
                            <div>
                                {
                                    show &&
                                    <input
                                    type='text'
                                    placeholder='email'
                                    className='form-control'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                }

                            </div>
                            <div className="row">
                                <div className="col d-grid gap-2 mx-auto">
                                    {
                                        show &&
                                        <button className='btn btn-primary' type='submit' onClick={onSubmit}>Save</button>
                                    }
                                    {
                                        buttonEdit &&
                                        <button className='btn btn-primary' type='submit' onClick={onEdit}>Edit</button>
                                    }

                                </div>
                                <div className="col d-grid gap-2 mx-auto">
                                    <button className='btn btn-secondary' type='submit' onClick={onCancel}>Cancel</button>
                                </div>
                                <div className="col d-grid gap-2 mx-auto">
                                    <button className='btn btn-danger' type='submit' onClick={onDelete}>Delete</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className='row'>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
