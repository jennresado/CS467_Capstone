import 'bootstrap/dist/css/bootstrap.min.css'

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const Contact = () => {
    return (
        <div className='contactPage'>
            <div className='row justify-content-center'>
                <div className='col-xl-8'>
                    <div className='row'>
                        <h1>Contact Us</h1>
                        <p>Do you have any questions? Please let us know.
                            <br></br>
                            Our team will get back to you shortly.
                        </p>
                        <Container>
                            <Form>
                                <Form.Group controlId="form.Name">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" />
                                </Form.Group>
                                <br></br>
                                <Form.Group controlId="form.Email">
                                    <Form.Label>Email Address:</Form.Label>
                                    <Form.Control type="email" placeholder="name@example.com" />
                                </Form.Group>
                                <br></br>
                                <Form.Group controlId="form.Textarea">
                                    <Form.Label>Comment:</Form.Label>
                                    <Form.Control as="textarea" rows={3} />
                                </Form.Group>
                                <br></br>
                                <Button variant="primary" type="Submit">Submit</Button>
                            </Form>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact

