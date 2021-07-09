import { useState } from 'react'

const Animal = () => {
    // need to pass in animal id
    // need to pass in list of type of animal

    // need to pass in list of breed
    // need to pass in disposition
    // upload image url
    // need to pass in availability
    // news item 
    // description 
    const onSubmit = (e) => {
        e.preventDefault()

        // if(!username && !password) {
        //     return
        // }

        // onLogin({ username, password })
        //     .then(() => {
        //         history.push('/dashboard')
        //     }).catch((err) => {
        //         setError(true)
        //         setUsername('')
        //         setPassword('')
        //     })     
    }
    
    return (
        <div className='generalFormat'>
            <div className='row justify-content-center'>
                <div className='col-sm-10 col-md-6 col-lg-4'>
                    <div className='row'>
                        <h1>Animal Profile</h1>
                    </div>
                    <div className='row'>
                        <form className='animalForm' onSubmit={onSubmit}>
                            <div>
                            <input 
                                    type='text'
                                    placeholder='Type'
                                    className='form-control'
                                    // value={type}
                                    // onChange={(e) => setType(e.target.value)}
                            />
                            </div>
                            <div>
                                <input 
                                    type='text'
                                    placeholder='Breed'
                                    className='form-control'
                                    // value={breed}
                                    // onChange={(e) => setBreed(e.target.value)}
                            />
                            </div>
                            <div>
                            <div className="input-group mb-3">
                                <div className="input-group-text">
                                    <input className="form-check-input mt-0" type="checkbox" value="Good with other animals" aria-label="Checkbox for following text input" />
                                </div>
                            </div>
                            </div>
                            <div>
                                <input 
                                    type='text'
                                    placeholder='Picture'
                                    className='form-control'
                                    // value={picture}
                                    // onChange={(e) => setPicture(e.target.value)}
                            />
                            </div>
                            <div>
                                <input 
                                    type='text'
                                    placeholder='Availability'
                                    className='form-control'
                                    // value={availability}
                                    // onChange={(e) => setAvailability(e.target.value)}
                            />
                            </div>
                            <div>
                                <input 
                                    type='text'
                                    placeholder='News item'
                                    className='form-control'
                                    // value={breed}
                                    // onChange={(e) => setBreed(e.target.value)}
                            />
                            </div>
                            <div>
                                <input 
                                    type='text'
                                    placeholder='Description'
                                    className='form-control'
                                    // value={description}
                                    // onChange={(e) => setDescription(e.target.value)}
                            />
                            </div>
                            <div className='row'>
                                <button className='btn btn-primary' type='submit'>Save</button>
                                <button className='btn btn-primary' type='submit'>Cancel</button>
                                <button className='btn btn-primary' type='submit'>Delete Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Animal
