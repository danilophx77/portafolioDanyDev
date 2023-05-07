import reac from "../assets/img/react.png";
import node from "../assets/img/node.png";
import js from "../assets/img/js.png";
import html from "../assets/img/html.svg"
import css from "../assets/img/css.png"
import tailwind from "../assets/img/tailwind.png"
import express from "../assets/img/express.png"
import mysql from "../assets/img/MySQL.png"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Skills</h2>
                        <p>My skills to highlight are:</p>
                        <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                            <div className="item">
                                <img src={reac} alt="Image1" />
                                <h5>React js</h5>
                            </div>
                            <div className="item">
                                <img src={node} alt="Image2" />
                                <h5>Node js</h5>
                            </div>
                            <div className="item">
                                <img src={js} alt="Image3" />
                                <h5>JavaScript</h5>
                            </div>
                            <div className="item">
                                <img src={html} alt="Image4" />
                                <h5>HTML</h5>
                            </div>
                            <div className="item">
                                <img src={css} alt="Image5" />
                                <h5>CSS</h5>
                            </div>
                            <div className="item">
                                <img src={tailwind} alt="Image6" />
                                <h5>Tailwind</h5>
                            </div>
                            <div className="item">
                                <img src={express} alt="Image7" />
                                <h5>Express js</h5>
                            </div>
                            <div className="item">
                                <img src={mysql} alt="Image8" />
                                <h5>MySQL</h5>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        
    </section>
  )
}
