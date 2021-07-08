import { Link } from 'react-router-dom'
import { FaCameraRetro } from 'react-icons/fa'
import landingImg1 from '../assets/landing_1.jpg'
import landingImg2 from '../assets/landing_2.jpg'
import landingImg3 from '../assets/landing_3.jpg'

const Landing = () => {
    return (
        <div className='generalFormat'>
            <div className='row justify-content-center'>
                <div className='col-xl-8'>
                    <div className='row'>
                        <h1>Bring Me Home</h1>
                    </div>
                    <div className='row'>
                        <div id="carouselExampleSlidesOnly" className="carousel slide spreadImgs" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src={landingImg1} className="d-block w-100" alt="Two dogs running side by side"></img>
                                </div>
                                <div className="carousel-item">
                                    <img src={landingImg2} className="d-block w-100" alt="Kitty laying down"></img>
                                </div>
                                <div className="carousel-item">
                                    <img src={landingImg3} className="d-block w-100" alt="Two guinea pigs eating carrots"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <p>
                            Each year, it's estimated that more than one million adoptable dogs and cats are euthanized in the United States because too many pets come into shelters and too few people consider adoption when looking for a pet.
                        </p>
                        <p>
                            Adopt a pet, save a life, and get a new best friend.
                        </p>
                        <p className='imgCredit'>
                            <FaCameraRetro></FaCameraRetro> by 
                            <a href="https://unsplash.com/@alvannee?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Alvan Nee </a>, 
                            <a href="https://unsplash.com/@houcong?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Cong H</a>,
                            <a href="https://unsplash.com/@bonniekdesign?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Bonnie Kittle</a> on 
                            <a href="https://unsplash.com/s/photos/pets?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Unsplash</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing
