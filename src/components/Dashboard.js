import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Dashboard = ({ animalsDb }) => {
    let imageBase64 = 'data:image/png;base64,'

    return (
        <div className='generalFormat'>
            <h1>Dashboard</h1>
            {/* Search and filter */}
            {/* Tiles */}
            <div className="container">
                <div className="row row-cols-md-2 row-cols-lg-4">
                    {animalsDb.map((e, key) => {
                        return <div>
                            <div className="card mb-3">
                                <div className="card-body">
                                    <img className="card-img-top rounded mb-3" src={imageBase64 + e.pic}></img>
                                    <h5 className="card-title">{e.animal_id}</h5>
                                    <div className="cardDetail">
                                        <p><strong>Type</strong>: {e.type}</p>
                                        <p>
                                            <strong>Breed</strong>: 
                                            {e.breeds.map((e, key) => {return <li key={key}>{e}</li>})}
                                        </p>
                                        <p>
                                            <strong>Disposition</strong>:
                                            {e.disposition.map((e, key) => {return <li key={key}>{e}</li> })}
                                        </p>
                                        <p><strong>Availability</strong>: {e.availability}</p>
                                        {/* <p><strong>News Item</strong>: {e.news_item}</p> */}
                                        <p><strong>Description</strong>: {e.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
