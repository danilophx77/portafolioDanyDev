import { Container, Row, Col } from "react-bootstrap";

import logo from "../assets/img/logo.jpg";
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/github7.png';

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          
          <Col size={12} sm={6}>
            <img className="logo" src={logo} alt="Logo" />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/danilophx77/" target='_blank'rel="noreferrer"><img src={navIcon1} alt="" /></a>
              <a href="https://github.com/danilophx77" target='_blank'rel="noreferrer"><img src={navIcon2} alt="" /></a>
                
              
            </div>
            <p>Copyright 2023. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
