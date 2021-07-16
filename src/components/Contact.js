import 'bootstrap/dist/css/bootstrap.min.css'

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { FaLocationArrow, FaPhoneAlt, FaCameraRetro } from 'react-icons/fa';
import contactImg1 from '../assets/contactUs.jpg'

const Contact = () => {
    return (
        <div className='contactPage'>
            <div className='row justify-content-center'>
                <div className='col-xl-8'>
                    <div className='row'>
                        <h1>Contact Us</h1>
                        <br></br>
                        <p>Do you have any questions? Please let us know.
                        </p>
                         <text> < FaPhoneAlt /> (123) 456-7890 </text>
                        <br></br>
                         <text> <FaLocationArrow /> 321 Waggy Tails Drive | Corvallis, OR 97333  </text>
                        <br></br> 
                        <br></br> 
                        <div className='row'>
                            <img src={contactImg1} className='img-fluid rounded loginImg'></img>
                            <p className='imgCredit'>
                                <FaCameraRetro></FaCameraRetro> by <a href="https://unsplash.com/@camylla93?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Camylla Battani</a> on <a href="https://unsplash.com/s/photos/question?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact

