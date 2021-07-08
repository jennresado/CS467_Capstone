import { Link } from 'react-router-dom'
import { FaCameraRetro } from 'react-icons/fa'
import aboutImg1 from '../assets/about_1.jpg'

const About = () => {
    return (
        <div className='aboutPage'>
            <div className='row justify-content-center'>
                <div className='col-xl-8'>
                    <div className='row aboutImg'>
                        <h1>About Bring Me Home</h1>
                    </div>
                    <div className='row'>
                        <img className='img-fluid' src={aboutImg1}></img>
                    </div>
                    <div className='row'>
                        <p>
                            Each year, it's estimated that more than one million adoptable dogs and cats are euthanized in the United States because too many pets come into shelters and too few people consider adoption when looking for a pet.
                        </p>
                        <p>
                            Adopt a pet, save a life, and get a new best friend.
                        </p>
                        <p>
                            <FaCameraRetro></FaCameraRetro> by 
                            <a href="https://unsplash.com/@ericjamesward?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Eric Ward</a> on 
                            <a href="https://unsplash.com/s/photos/pets?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Unsplash</a>
                        </p>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default About
