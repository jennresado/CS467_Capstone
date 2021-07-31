import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { VscLoading } from 'react-icons/vsc'

const Dashboard = ({ animalsDb, types, breeds, dispositions, datesCreated }) => {
    let imageBase64 = 'data:image/png;base64,'

    const [filter, setFilter] = useState(false)  // when filter is applied only animals matching search filter criteria are shown 
    const [noResults, setNoResults] = useState(false) // if search criteria has no results message is shown
    const [results, setResults] = useState([]) // array of animals that match applied filter
    const [dates, setDates] = useState([]) // array of non-duplicated dates that are used to populate the select

    const helperRemoveDuplicateDate = (date) => {

        for (let i = 0; i < datesCreated.length; i++) {
            if (dates.includes(date)) {
                return
            }
            dates.push(date) // create list of dates without duplicates
        }
    }

    // Called on page load, removed the duplicate dates in API list to populate select options
    const removeDuplicateDate = () => {

        // API for datesCreated contains dupliactes
        for (let i = 0; i < datesCreated.length; i++) {
            // pass the helper one date to check
            helperRemoveDuplicateDate(datesCreated[i].date_created)
        }
    }
    removeDuplicateDate()

    const handleChangeBreed = (breed) => {

        results.length = 0  // clear array in case of previous filter

        if (breed === 'Breed') {
            setFilter(false) // display all animals
            return

        } else {

            setFilter(true) // display only animals that match filter

            for (let i = 0; i < animalsDb.length; i++) {
                // animals can be multiple breeds and these are in one array
                for (let j = 0; j < animalsDb[i].breeds.length; j++)
                    if (animalsDb[i].breeds[j] == breed) {
                        results.push(animalsDb[i]) // store animals that match filter in results array 
                    }
            }
        }
        if (results.length === 0) {
            setNoResults(true) // display no results message
        }
    }

    const handleChangeType = (type) => {

        results.length = 0  // clear array in case of previous filter

        if (type === 'Type') {
            setFilter(false) // display all animals
            return

        } else {
            setFilter(true) // display only animals that match filter
            for (let i = 0; i < animalsDb.length; i++) {
                if (animalsDb[i].type == type) {
                    results.push(animalsDb[i])
                }
            }
        }
        if (results.length === 0) {
            setNoResults(true) // display no results message
        }
    }

    const handleChangeDisposition = (disposition) => {

        results.length = 0  // clear array in case of previous filter

        if (disposition === 'Disposition') {
            setFilter(false)
            return

        } else {
            setFilter(true)

            for (let i = 0; i < animalsDb.length; i++) {
                // animals can be multiple dispositions and these are in one array
                for (let j = 0; j < animalsDb[i].disposition.length; j++)
                    if (animalsDb[i].disposition[j] == disposition) {

                        results.push(animalsDb[i])
                    }
            }
        }
        if (results.length === 0) {
            setNoResults(true) // display no results message
        }
    }

    const handleChangeDate = (date) => {

        results.length = 0  // clear array in case of previous filter

        if (date === 'Date Created') {
            setFilter(false) // display all animals
            return

        } else {
            setFilter(true) // display only animals that match filter

            // date paramater needs to match animalsDb.date_created format
            var dayMonth = date.slice(0, 4) // grab day and month
            var year = date.slice(5, 9) // grab the year
            var formattedDate = year.concat("-0", dayMonth, "T00:00:00.000Z") //match format of animals daate_created property

            for (let i = 0; i < animalsDb.length; i++) {
                if (animalsDb[i].date_created == formattedDate) {
                    results.push(animalsDb[i])
                }
            }
        }
        if (results.length === 0) {
            setNoResults(true) // display no results message
        }
    }

    // display all animnals, reset and display filter options
    const handleReset = (e) => {
        setNoResults(false)     // don't display no results message
        setFilter(false)       // display all animals in DB
    }

    return (
        <div className='generalFormat'>
            <h1>Dashboard</h1>
            {/* Search and filter */}
            <div className='dashboardSearch'>
                <div className="row">
                    <div className='col'>
                        <h3>Search</h3>
                        {
                            filter &&  //if filter applied reset button display
                            <button className='btn btn-primary' onClick={(e) => { handleReset() }}>Reset</button>
                        }
                    </div>
                    {
                        !filter && //if filter applied filter options hidden
                        <div className='col'>
                            <select
                                className="form-select"
                                id="id"
                                onChange={(e) => { handleChangeBreed(e.target[e.target.selectedIndex].value) }}
                            >
                                <option>Breed</option>
                                {breeds.map((e, key) => {
                                    return <option key={key} value={e.breed}>{e.breed}</option>
                                })}
                            </select>
                        </div>
                    }
                    {
                        !filter && //if filter applied filter options hidden
                        <div className='col'>
                            <select
                                className="form-select"
                                id="id"
                                onChange={(e) => { handleChangeType(e.target[e.target.selectedIndex].value) }}
                            >
                                <option>Type</option>
                                {types.map((e, key) => {
                                    return <option key={key} value={e.type}>{e.type}</option>
                                })}
                            </select>

                        </div>
                    }

                    {
                        !filter && //if filter applied filter options hidden
                        <div className='col'>
                            <select
                                className="form-select"
                                id="id"
                                onChange={(e) => { handleChangeDisposition(e.target[e.target.selectedIndex].value) }}
                            >
                                <option>Disposition</option>
                                {dispositions.map((e, key) => {
                                    return <option key={key} value={e.disposition}>{e.disposition}</option>
                                })}
                            </select>
                        </div>
                    }
                    {
                        !filter &&  //if filter applied filter options hidden
                        <div className='col'>
                            <select
                                className="form-select"
                                id="id"
                                onChange={(e) => { handleChangeDate(e.target[e.target.selectedIndex].value) }}
                            >
                                <option>Date Created</option>
                                {dates.map((e, key) => {
                                    return <option key={key} value={e}>{e}</option>
                                })}
                            </select>
                        </div>
                    }
                </div>

            </div>
            {/* Tiles */}
            {
                // display all animals in animalsDB if no filter is on
                !filter &&

                <div className="container">
                    {animalsDb.length === 0 && <VscLoading className="loadingIcon"></VscLoading>}
                    <div className="row row-cols-md-2 row-cols-lg-4">
                        {animalsDb.map((e, key) => {
                            return <div key={key}>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <img className="card-img-top rounded mb-3" src={imageBase64 + e.pic}></img>
                                        <h5 className="card-title">{e.animal_id}</h5>
                                        <div className="cardDetail mb-3">
                                            <p><strong>Type</strong>: {e.type}</p>
                                            <p>
                                                <strong>Breed</strong>:
                                                {e.breeds.map((e, key) => { return <li key={key}>{e}</li> })}
                                            </p>
                                            <p>
                                                <strong>Disposition</strong>:
                                                {e.disposition.map((e, key) => { return <li key={key}>{e}</li> })}
                                            </p>
                                            <p><strong>Availability</strong>: {e.availability}</p>
                                            {/* <p><strong>News Item</strong>: {e.news_item}</p> */}
                                            <p><strong>Description</strong>: {e.description}</p>
                                        </div>
                                        {
                                            e.availability === "Adopted" ?
                                                <Link to="/contact" className="btn btn-secondary d-grid disabledLink">Adopted</Link> :
                                                <Link to="/contact" className="btn btn-primary d-grid">Adopt</Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            }
            {
                // Display message if criteria does not match for animals in DB
                // To distinguish between loading and no results
                filter && noResults &&
                <p className='userProfileError'><strong>No Results for the Selected Criteria -  Try a Different Search </strong></p>
            }
            {
                // display animals in filter results when filter applied & results are available for criteria
                filter && !noResults &&
                <div className="container">
                    {results.length === 0 && <h5><VscLoading className="loadingIcon"></VscLoading></h5>}
                    <div className="row row-cols-md-2 row-cols-lg-4">
                        {results.map((e, key) => {
                            return <div key={key}>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <img className="card-img-top rounded mb-3" src={imageBase64 + e.pic}></img>
                                        <h5 className="card-title">{e.animal_id}</h5>
                                        <div className="cardDetail mb-3">
                                            <p><strong>Type</strong>: {e.type}</p>
                                            <p>
                                                <strong>Breed</strong>:
                                                {e.breeds.map((e, key) => { return <li key={key}>{e}</li> })}
                                            </p>
                                            <p>
                                                <strong>Disposition</strong>:
                                                {e.disposition.map((e, key) => { return <li key={key}>{e}</li> })}
                                            </p>
                                            <p><strong>Availability</strong>: {e.availability}</p>
                                            {/* <p><strong>News Item</strong>: {e.news_item}</p> */}
                                            <p><strong>Description</strong>: {e.description}</p>
                                        </div>
                                        {
                                            e.availability === "Adopted" ?
                                                <Link to="/contact" className="btn btn-secondary d-grid disabledLink">Adopted</Link> :
                                                <Link to="/contact" className="btn btn-primary d-grid">Adopt</Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            }</div>

    )
}

export default Dashboard
