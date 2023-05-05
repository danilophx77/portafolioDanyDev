import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import emailjs from '@emailjs/browser'
import contactImg from "../assets/img/contact-img.svg";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import validator from "./validator";


export const Contact = () => {

  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(formDetails.email && formDetails.firstName && formDetails.lastName && formDetails.message){
      setButtonText("Sending...");
      let res = await emailjs.sendForm('service_yyw7gpo','template_pjbi0oa',e.target,'6CtWNYVRNqRmedPgn')
      
      setButtonText("Send");
      setFormDetails(formInitialDetails);
      if (res.status == 200) {
        setStatus({clas:'alert alert-success', succes: true, message: 'Message sent successfully'});
      } else {
        setStatus({ clas:'alert alert-danger', succes: false, message: 'Something went wrong, please try again later.'});
      }
    }else{
      setStatus({clas:'alert alert-danger', succes: true, message: 'Please complete the required fields *.'});
    }

    

  };

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <img className={isVisible ? "animate__animated animate__zoomIn" : ""} src={contactImg} alt="Contact Us"/>
              }
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <h2>Get In Touch</h2>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col size={12} sm={6} className="px-1">
                      <input name="firstName" type="text" value={formDetails.firstName} placeholder="First Name *" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input name="lastName" type="text" value={formDetails.lastName} placeholder="Last Name *" onChange={(e) => onFormUpdate('lastName', e.target.value)}/>
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input name="email" type="email" value={formDetails.email} placeholder="Email Address *" onChange={(e) => onFormUpdate('email', e.target.value)} />
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input name="phone" type="tel" value={formDetails.phone} placeholder="Phone No." onChange={(e) => onFormUpdate('phone', e.target.value)}/>
                    </Col>
                    <Col size={12} className="px-1">
                      <textarea name="message" rows="6" value={formDetails.message} placeholder="Message *" onChange={(e) => onFormUpdate('message', e.target.value)}></textarea>
                      {
                      status.message &&
                        
                        <div class={status.clas} role="alert">
                          {status.message}
                        </div>
                        // <div className={status.success === false ? "alert alert-error shadow-lg" : "alert alert-success shadow-lg"}>
                        // <div>
                        //   <span>{status.message}</span>
                        // </div>
                        // </div>
                      }
                      <button type="submit"><span>{buttonText}</span></button>
                    </Col>
                    
                  </Row>
                </form>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
