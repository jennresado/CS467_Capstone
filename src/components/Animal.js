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
                        <form>
                            <div className="input-group mb-3">
                                <select className="form-select" id="id">
                                    <option>Animal Id</option>
                                    {/* autofill based on data pulled from db */}
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <select className="form-select" id="type">
                                    <option>Type</option>
                                    <option value="dog">dog</option>
                                    <option value="cat">cat</option>
                                    <option value="other">other</option>
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <select className="form-select" id="breed">
                                    <option>Breed</option>
                                    <option value="chihuahua">chihuahua</option>
                                    <option value="labrador">labrador</option>
                                    <option value="siberian husky">siberian husky</option>
                                </select>
                            </div>
                            <label for="disposition">Disposition</label>
                            <div class="input-group mb-3">
                                <div class="input-group-text">
                                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" />
                                </div>
                                <input type="text" class="form-control" value="Good with other animals" aria-label="Text input with checkbox" />
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-text">
                                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" />
                                </div>
                                <input type="text" class="form-control" value="Good with children" aria-label="Text input with checkbox" />
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-text">
                                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" />
                                </div>
                                <input type="text" class="form-control" value="Animal must be leashed at all times" aria-label="Text input with checkbox" />
                            </div>
                            <div class="input-group mb-3">
                                <label>Picture</label>
                                <input type="file" class="form-control" id="inputGroupFile02" />
                                <label class="input-group-text" for="inputGroupFile02">Upload</label>
                            </div>
                            <div className="input-group mb-3">
                                <select className="form-select" id="availability">
                                    <option>Availability</option>
                                    <option value="not available">not available</option>
                                    <option value="available">available</option>
                                    <option value="pending">pending</option>
                                    <option value="adopted">adopted</option>
                                </select>
                            </div>
                            <input type='text' placeholder='News item' className='form-control'/>
                            <input type='text' placeholder='Description' className='form-control'/>
                            <div className="row">
                                <div className="col">
                                    <button className='btn btn-primary' type='submit'>Save</button>
                                </div>
                                <div className="col">
                                    <button className='btn btn-primary' type='submit'>Cancel</button>
                                </div>
                                <div className="col">
                                    <button className='btn btn-primary' type='submit'>Delete</button>
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
