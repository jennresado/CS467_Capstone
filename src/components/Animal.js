import { Link, useHistory } from 'react-router-dom'
import { useState } from 'react'
import animals from '../assets/Animals'

const Animal = () => {
    let history = useHistory()
    let types = Object.keys(animals)
    let availabilities = ['Not Available', 'Available', 'Pending', 'Adopted']
    const [id, setId] = useState('')
    const [type, setType] = useState('')
    const [selectBreeds, setSelectBreeds] = useState([])
    const [breed, setBreed] = useState('')
    const [disposition, setDisposition] = useState([])
    const [picture, setPicture] = useState('')
    const [availability, setAvailability] = useState('')
    const [newsItem, setNewsItem] = useState('')
    const [description, setDescription] = useState('')

    // need to pass in animal id
    // upload image url

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
                                <select 
                                    className="form-select" 
                                    id="id" 
                                    onChange={(e) => {setId(e.target.value)}}
                                >
                                    <option>Animal Id</option>
                                    {/* autofill based on data pulled from db */}
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <select 
                                    className="form-select" 
                                    id="type" 
                                    onChange={(e) => {setType(e.target[e.target.selectedIndex].value)}}
                                >
                                    <option>Type</option>
                                    {types.map((e, key) => {
                                        return <option key={key} value={e}>{e}</option>
                                    })}
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <select 
                                    className="form-select" 
                                    id="breed" 
                                    onClick={() => {setSelectBreeds(animals[type])}}
                                    onChange={(e) => {setBreed(e.target[e.target.selectedIndex].value)}}
                                >
                                    <option>Breed</option>
                                    {selectBreeds.map((e, key) => {
                                        return <option key={key} value={e}>{e}</option>
                                    })}
                                </select>
                            </div>
                            <fieldset>
                                <legend>Disposition</legend>
                                <div className="input-group mb-1">
                                    <div className="input-group-text">
                                        <input 
                                            className="form-check-input mt-0" 
                                            type="checkbox" 
                                            value="Good with other animals" 
                                            aria-label="Checkbox for following text input" 
                                            onChange={(e) => {setDisposition([...disposition, e.target.value])}}
                                        />
                                    </div>
                                    <input type="text" className="form-control" value="Good with other animals" aria-label="Text input with checkbox" readOnly/>
                                </div>
                                <div className="input-group mb-1">
                                    <div className="input-group-text">
                                        <input 
                                            className="form-check-input mt-0" 
                                            type="checkbox" 
                                            value="Good with children" 
                                            aria-label="Checkbox for following text input" 
                                            onChange={(e) => {setDisposition([...disposition, e.target.value])}}
                                        />
                                    </div>
                                    <input type="text" className="form-control" value="Good with children" aria-label="Text input with checkbox" readOnly/>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-text">
                                        <input 
                                            className="form-check-input mt-0" 
                                            type="checkbox" 
                                            value="Animal must be leashed at all times" 
                                            aria-label="Checkbox for following text input" 
                                            onChange={(e) => {setDisposition([...disposition, e.target.value])}}
                                        />
                                    </div>
                                    <input type="text" className="form-control" value="Animal must be leashed at all times" aria-label="Text input with checkbox" readOnly/>
                                </div>
                            </fieldset>
                            <div className="input-group mb-3">
                                <legend>Picture</legend>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="inputGroupFile02"   
                                    onChange = {(e) => {setPicture(e.target.files[0])}}
                                />
                                <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                            </div>
                            <div className="input-group mb-3">
                                <select 
                                    className="form-select" 
                                    id="availability" 
                                    onChange={(e) => {setAvailability(e.target[e.target.selectedIndex].value)}}
                                >
                                    <option>Availability</option>
                                    {availabilities.map((e, key) => {
                                        return <option key={key} value={e}>{e}</option>
                                    })}
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
