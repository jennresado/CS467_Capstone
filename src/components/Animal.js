import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import animals from '../assets/Animals'

const Animal = ({ animalsDb, onAddAnimal, onUpdateAnimal, onDeleteAnimal }) => {
    let history = useHistory()
    let types = Object.keys(animals)
    let availabilities = ['Not Available', 'Available', 'Pending', 'Adopted']
    const [id, setId] = useState('')
    const [idAnimal, setIdAnimal] = useState({})
    const [type, setType] = useState('')
    const [selectBreeds, setSelectBreeds] = useState([])
    const [breed, setBreed] = useState('')
    const [disposition, setDisposition] = useState([])
    const [picture, setPicture] = useState('')
    const [availability, setAvailability] = useState('')
    const [newsItem, setNewsItem] = useState('')
    const [description, setDescription] = useState('')

    // Clear form 
    const clearForm = () => {
        let checkboxes = document.getElementsByClassName("form-check-input")

        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }

        setType('')
        setSelectBreeds([])
        setBreed('')
        setDisposition([])
        setPicture('')
        setAvailability('')
        setNewsItem('')
        setDescription('')
    }

    // Prepopulate existing animal profile
    const handleChangeId = (id) => {
        clearForm()
        
        if (id === 'Animal Id') {
            setId('')
        } else {
            setId(id)
        }
        
        for (let i = 0; i < animalsDb.length; i++) {
            if (animalsDb[i].animal_id == id) {
                setIdAnimal(animalsDb[i])
                setType(animalsDb[i].type)
                // setBreed(animalsDb[i].breed)
                // for testing with dummy api
                setBreed("Collie")
                setDisposition(animalsDb[i].disposition)
                // setPicture(animalsDb[i])
                setAvailability(animalsDb[i].availability)
                setNewsItem(animalsDb[i].news_item)
                // setDescription(animalsDb[i].description)
                // for testing with dummy api
                setDescription("Friendly and cute!")
            }
        }
    }

    // Handle type change 
    const handleChangeType = (type) => {
        setType(type)
        setBreed('')
    }

    // Handle disposition change
    const handleChangeDisposition = (checked, value) => {
        // Add disposition
        if (checked) {
            setDisposition([...disposition, value])
        // Remove disposition
        } else {
            setDisposition(disposition.filter((d) => d !== value))
        }
    }

    // Convert picture to base64
    const convertToBase64 = (e) => {
        const content = e.target.result;
        setPicture(content)
    }

    // Handle change file
    const handleChangeFile = (file) => {
        let reader = new FileReader()
        reader.onloadend = convertToBase64
        reader.readAsDataURL(file)
    }

    // On click submit
    const onSubmit = (e) => {
        e.preventDefault()

        if (!type && !breed && !disposition && 
                !picture &&!availability && 
                !newsItem && !description) {
            return
        }

        const body = {
            "type": type,
            "breed": breed,
            "disposition": disposition,
            "picture": picture,
            "availability": availability,
            "newsItem": newsItem,
            "description": description
        }

        // Update if id
        if (id) {
            body["animal_id"] = id

            console.log(body)

            // onUpdateAnimal(body)
            // .then(() => {
            //     history.push('/dashboard')
            // }).catch((err) => {
            //     console.log(err)
            // })

        // Add if new animal
        } else {
            console.log(body)

            // onAddAnimal(body)
            // .then(() => {
            //     history.push('/dashboard')
            // }).catch((err) => {
            //     console.log(err)
            // })
        }  
    }

    // On click cancel
    const onCancel = (e) => {
        e.preventDefault()

        history.push('/dashboard')
    }

    // On click delete
    const onDelete = (e) => {
        e.preventDefault()

        console.log(id)

        // onDeleteAnimal(id)
        // .then(() => {
        //     history.push('/dashboard')
        // }).catch((err) => {
        //     console.log(err)
        // })
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
                                    onChange={(e) => {handleChangeId(e.target[e.target.selectedIndex].value)}}
                                >
                                    <option>Animal Id</option>
                                    {animalsDb.map((e, key) => {
                                        return <option key={key} value={e.animal_id}>{e.animal_id}</option>
                                    })}
                                </select>
                            </div>
                            {
                                id &&
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">Making Changes To</h5>
                                        <p><strong>Instructions</strong>: When updating, input(s) below will overwrite the corresponding field(s). Leave inputs blank if no changes are to be made to certain fields.</p>
                                        <p><strong>Id</strong>: {idAnimal.animal_id}</p>
                                        
                                        <p><strong>Type</strong>: {idAnimal.type}</p>
                                        <p><strong>Breed</strong>: {idAnimal.breed}</p>
                                        <p>
                                            <strong>Disposition</strong>:
                                            {idAnimal.disposition.map((e, key) => {return <li key={key}>{e}</li> })}
                                        </p>
                                        <p> 
                                            <strong>Picture</strong>:
                                            <img className="card-image" src={idAnimal.picture}></img>
                                        </p>
                                        <p><strong>Availability</strong>: {idAnimal.availability}</p>
                                        <p><strong>News Item</strong>: {idAnimal.news_item}</p>
                                        <p><strong>Description</strong>: {idAnimal.description}</p>
                                    </div>
                                </div>
                            }
                            <div className="input-group mb-3">
                                <select 
                                    className="form-select" 
                                    id="type" 
                                    value={type}
                                    onChange={(e) => {handleChangeType(e.target[e.target.selectedIndex].value)}}
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
                                    value={breed}
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
                                            onChange={(e) => {handleChangeDisposition(e.target.checked, e.target.value)}}
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
                                            onChange={(e) => {handleChangeDisposition(e.target.checked, e.target.value)}}
                                            // onChange={(e) => {setDisposition([...disposition, e.target.value])}}
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
                                            onChange={(e) => {handleChangeDisposition(e.target.checked, e.target.value)}}
                                            // onChange={(e) => {setDisposition([...disposition, e.target.value])}}
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
                                    accept="image/*"
                                    onChange={(e) => {handleChangeFile(e.target.files[0])}}
                                />
                                <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                            </div>
                            <div className="input-group mb-3">
                                <select 
                                    className="form-select" 
                                    id="availability" 
                                    value={availability}
                                    onChange={(e) => {setAvailability(e.target[e.target.selectedIndex].value)}}
                                >
                                    <option>Availability</option>
                                    {availabilities.map((e, key) => {
                                        return <option key={key} value={e}>{e}</option>
                                    })}
                                </select>
                            </div>
                            <input type='text' placeholder="News Item" className='form-control input-group mb-3' onChange={(e) => {setNewsItem(e.target.value)}}/>
                            <input type='text' placeholder="Description" className='form-control input-group mb-3' onChange={(e) => {setDescription(e.target.value)}}/>
                            <div className="row">
                                <div className="col d-grid gap-2 mx-auto">
                                    <button className='btn btn-primary' type='submit' onClick={onSubmit}>{id ? "Update" : "Add"}</button>
                                </div>
                                <div className="col d-grid gap-2 mx-auto">
                                    <button className='btn btn-secondary' type='submit' onClick={onCancel}>Cancel</button>
                                </div>
                                {
                                    id &&
                                    <div className="col d-grid gap-2 mx-auto">
                                        <button className='btn btn-danger' type='submit' onClick={onDelete}>Delete</button>
                                    </div>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Animal
