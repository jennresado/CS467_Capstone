import { Link } from 'react-router-dom'
import { FaCameraRetro } from 'react-icons/fa'
import aboutImg1 from '../assets/about_1.jpg'

const About = () => {
    return (
        <div className='aboutPage'>
            <div className='row justify-content-center'>
                <div className='col-xl-8'>
                    <div className='row'>
                        <h1>About Bring Me Home</h1>
                    </div>
                    <div className='row'>
                        <img className='img-fluid spreadImgs' src={aboutImg1}></img>
                    </div>
                    <div className='row'>
                        <p>
                            Bring Me Home goal is to help you find a new best friend and save a life.
                        </p>
                        <h4>Tops reasons to adopt a pet</h4> 
                        <ol>
                            <li>
                                Because you'll save a life.
                            </li>
                            <li>
                                Because you'll get a great animal.
                            </li>
                            <li>
                                Because it'll cost you less.
                            </li>
                            <li>
                                Because of the bragging rights.
                            </li>
                            <li>
                                Because it's one way to fight puppy mills.
                            </li>
                            <li>
                                Because your home will thank you.
                            </li>
                            <li>
                                Because all pets are good for your health, but adoptees offer an extra boost.
                            </li>
                            <li>
                                Because adoption helps more than just one animal.
                            </li>
                            <li>
                                Because Bring Me Home makes it easy.
                            </li>
                            <li>
                                Because you'll change a homeless animal's whole world.
                            </li>
                        </ol>
                        <p>
                            Article by <a href="https://www.humanesociety.org/resources/top-reasons-adopt-pet">Humane Society</a>
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
