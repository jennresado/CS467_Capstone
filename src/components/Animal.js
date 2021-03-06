import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import animals from '../assets/Animals'
import dispositions from '../assets/Dispositions'
import availabilities from '../assets/Availabilities'

const Animal = ({ animalsDb, onAddAnimal, onUpdateAnimal, onDeleteAnimal }) => {
    let history = useHistory()
    let types = Object.keys(animals)
    let imageBase64 = 'data:image/png;base64,'
    const [error, setError] = useState(false)
    const [breedError, setBreedError] = useState(false)
    const [id, setId] = useState('')
    const [idAnimal, setIdAnimal] = useState({})
    const [type, setType] = useState('')
    const [selectBreeds, setSelectBreeds] = useState([])
    const [breed, setBreed] = useState([])
    const [disposition, setDisposition] = useState([])
    const [picture, setPicture] = useState('')
    const [availability, setAvailability] = useState('')
    const [newsItem, setNewsItem] = useState('')
    const [description, setDescription] = useState('')
    const objectMapping = {
        "id": id,
        "type": type,
        "selectBreeds": selectBreeds,
        "breeds": breed,
        "disposition": disposition,
        "pic": picture,
        "availability": availability,
        "news_item": newsItem,
        "description": description
    }

    // Clear checkboxes
    const clearCheckboxes = (category) => {
        let checkboxes;

        if (category === "all") {
            checkboxes = document.getElementsByClassName("form-check-input")
        } else if (category === "breed") {
            checkboxes = document.getElementsByClassName("breedCheckbox")
        }

        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
    }

    // Clear form 
    const clearForm = () => {
        let newsItemInput = document.querySelector("#newsItem")
        let descriptionInput = document.querySelector("#description")

        newsItemInput.value = ""
        descriptionInput.value = ""

        clearCheckboxes("all")
        setError(false)
        setType('')
        setSelectBreeds([])
        setBreed([])
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
            return
        } else {
            setId(id)
        }
        
        for (let i = 0; i < animalsDb.length; i++) {
            if (animalsDb[i].animal_id == id) {
                setIdAnimal(animalsDb[i])
            }
        }
    }

    // Handle type change 
    const handleChangeType = (type) => {
        setType(type)
        clearCheckboxes("breed")

        if (type === 'Type') {
            setSelectBreeds([])
        } else {
            setSelectBreeds(animals[type])
            setBreed([])
        }
    }

    // Handle breed change
    const handleChangeBreed = (checked, value) => {
        // Max 3 breeds
        if (type !== "other" && breed.length == 3) {
            let element = document.getElementById(value)

            element.checked = false
            setBreedError(true)

            return
        } else if (type === "other" && breed.length == 1) {
            let element = document.getElementById(value)

            element.checked = false
            setBreedError(true)

            return
        }
        // Add breed
        if (checked) {
            setBreed([...breed, value])
        // Remove breed
        } else {
            setBreed(breed.filter((d) => d !== value))
        }
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
        setPicture(content.split("base64,")[1])
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
        
        let body = {}

        // Update if id
        if (id) {
            if (type && breed.length === 0) {
                setError(true)
                return
            }

            for (const key in idAnimal) {
                if (key === 'breeds' || key === 'disposition') {
                    if (objectMapping[key].length > 0) {
                        body[key] = objectMapping[key]
                    }
                } else if (objectMapping[key]) {
                    body[key] = objectMapping[key]
                } else {
                    body[key] = idAnimal[key]
                }
            }

            onUpdateAnimal(body)
            .then(() => {
                history.push('/dashboard')
            }).catch((err) => {
                clearForm()
                setError(true)
            })
        // Add if new animal
        } else {
            if (!type || 
                    breed.length === 0 || disposition.length === 0 || 
                    !picture || !availability || 
                    !newsItem || !description) {
                setError(true)
                return
            }

            body = {
                "type": type,
                "breeds": breed,
                "disposition": disposition,
                "pic": picture,
                "availability": availability,
                "news_item": newsItem,
                "description": description
            }

            onAddAnimal(body)
            .then(() => {
                history.push('/dashboard')
            }).catch((err) => {
                clearForm()
                setError(true)
            })
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

        onDeleteAnimal(id)
        .then(() => {
            history.push('/dashboard')
        }).catch((err) => {
            clearForm()
            setError(true)
        })
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
                            <p>
                                To update or delete an existing animal, select the animal's id.
                            </p>
                            {error && <p className="animalError">Invalid or missing field(s).</p>}
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
                                        <p>
                                            <strong>Breed</strong>: 
                                            {idAnimal.breeds.map((e, key) => {return <li key={key}>{e}</li>})}
                                        </p>
                                        <p>
                                            <strong>Disposition</strong>:
                                            {idAnimal.disposition.map((e, key) => {return <li key={key}>{e}</li> })}
                                        </p>
                                        <p> 
                                            <strong>Picture</strong>:
                                            <img className="card-image" src={imageBase64 + idAnimal.pic}></img>
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
                            {breedError && <p className="breedError">Maximum of 3 breeds allowed for cats and dogs. Maximum of 1 breed allowed for other animal types. If more than 3 breeds, consider "Mixed Breed" option.</p>}
                            {
                                selectBreeds.length > 0 &&
                                <ul className="list-group mb-3 breed">
                                    <li className="list-group-item">Breed</li>
                                    {selectBreeds.map((e, key) => {
                                        return <li key={key} className="list-group-item">
                                            <input 
                                                className="form-check-input me-1 breedCheckbox" 
                                                type="checkbox"
                                                value={e}
                                                key={key}
                                                id={e}
                                                onChange={(e) => {handleChangeBreed(e.target.checked, e.target.value)}}
                                            />
                                            {e}
                                        </li>
                                    })}
                                </ul>
                            }
                            <ul className="list-group mb-3 disposition">
                                <li className="list-group-item">Disposition</li>
                                {dispositions.map((e, key) => {
                                    return <li key={key} className="list-group-item">
                                        <input 
                                            className="form-check-input me-1" 
                                            type="checkbox"
                                            value={e}
                                            key={key}
                                            onChange={(e) => {handleChangeDisposition(e.target.checked, e.target.value)}}
                                        />
                                        {e}
                                    </li>
                                })}
                            </ul>
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
                            {
                                picture && 
                                <img className="card-img-top mb-3" src={imageBase64 + picture}></img>
                            }
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
                            <input type='text' placeholder="News Item" className='form-control input-group mb-3' id="newsItem" onChange={(e) => {setNewsItem(e.target.value)}}/>
                            <input type='text' placeholder="Description" className='form-control input-group mb-3' id="description" onChange={(e) => {setDescription(e.target.value)}}/>
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
