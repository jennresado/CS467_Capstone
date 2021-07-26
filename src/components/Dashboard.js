import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { VscLoading } from 'react-icons/vsc'

const Dashboard = ({ animalsDb }) => {
    let imageBase64 = 'data:image/png;base64,'

    return (
        <div className='generalFormat'>
            <h1>Dashboard</h1>
            {/* Search and filter */}
            
            {/* Tiles */}
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
        </div>
    )
}

export default Dashboard
