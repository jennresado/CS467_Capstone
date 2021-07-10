import { Link, useHistory } from 'react-router-dom'
import { useState } from 'react'

const Animal = () => {
    let history = useHistory()
    const [id, setId] = useState('')
    const [type, setType] = useState('')
    const [breed, setBreed] = useState('')
    const [disposition, setDisposition] = useState('')
    const [picture, setPicture] = useState('')
    const [availability, setAvailability] = useState('')
    const [newsItem, setNewsItem] = useState('')
    const [description, setDescription] = useState('')

    // need to pass in animal id
    // need to pass in list of type of animal

    // Populate select breed based on animal type
    const popBreed = (e) => {
        const type = e.target.value 

        setType(type)

        
    }
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

    // on click cancel
    const onCancel = (e) => {
        e.preventDefault()

        history.push('/dashboard')
    }

    // on click delete
    const onDelete = (e) => {
        e.preventDefault()
    }
    
    return (
        <div className='generalFormat'>
            <div className='row justify-content-center'>
                <div className='col-sm-10 col-md-6 col-lg-4'>
                    <div className='row'>
                        <h1>Animal Profile</h1>
                    </div>
                    <div className='row' id='animalDiv'>
                        <form className='animalForm'>
                            <div className="input-group mb-3">
                                <select className="form-select" id="id" onChange={(e) => {setId(e.target.value)}}>
                                    <option>Animal Id</option>
                                    {/* autofill based on data pulled from db */}
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <select className="form-select" id="type" onChange={(e) => {popBreed(e.target.value)}}>
                                    <option>Type</option>
                                    <option value="dog">Dog</option>
                                    <option value="cat">Cat</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <select className="form-select" id="breed" onChange={(e) => {setBreed(e.target.value)}}>
                                    <option>Breed</option>
                                    <option value="chihuahua">Chihuahua</option>
                                    <option value="labrador">Labrador</option>
                                    <option value="siberian husky">Siberian Husky</option>
                                    <option value="calico">Calico</option>
                                    <option value="hamster">Hamster</option>
                                </select>
                            </div>
                            <fieldset>
                                <legend>Disposition</legend>
                                <div className="input-group mb-1">
                                    <div className="input-group-text">
                                        <input className="form-check-input mt-0" type="checkbox" name="disposition[]" value="Good with other animals" aria-label="Checkbox for following text input" />
                                    </div>
                                    <input type="text" className="form-control" value="Good with other animals" aria-label="Text input with checkbox" />
                                </div>
                                <div className="input-group mb-1">
                                    <div className="input-group-text">
                                        <input className="form-check-input mt-0" type="checkbox" name="disposition[]" value="Good with children" aria-label="Checkbox for following text input" />
                                    </div>
                                    <input type="text" className="form-control" value="Good with children" aria-label="Text input with checkbox" />
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-text">
                                        <input className="form-check-input mt-0" type="checkbox" name="disposition[]" value="Animal must be leashed at all times" aria-label="Checkbox for following text input" />
                                    </div>
                                    <input type="text" className="form-control" value="Animal must be leashed at all times" aria-label="Text input with checkbox" />
                                </div>
                            </fieldset>
                            <div class="input-group mb-3">
                                <legend>Picture</legend>
                                <input type="file" class="form-control" id="inputGroupFile02" />
                                <label class="input-group-text" for="inputGroupFile02">Upload</label>
                            </div>
                            <div className="input-group mb-3">
                                <select className="form-select" id="availability" onChange={(e) => {setAvailability(e.target.value)}}>
                                    <option>Availability</option>
                                    <option value="not available">Not Available</option>
                                    <option value="available">Available</option>
                                    <option value="pending">Pending</option>
                                    <option value="adopted">Adopted</option>
                                </select>
                            </div>
                            <input type='text' placeholder='News item' className='form-control input-group mb-3' onChange={(e) => {setNewsItem(e.target.value)}}/>
                            <input type='text' placeholder='Description' className='form-control input-group mb-3' onChange={(e) => {setDescription(e.target.value)}}/>
                            <div className="row">
                                <div className="col d-grid gap-2 mx-auto">
                                    <button className='btn btn-primary' type='submit'>Save</button>
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
                </div>
            </div>
        </div>
    )
}

export default Animal
