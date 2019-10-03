import React, { Component } from 'react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <header id="header">
                    <div className="container-fluid">

                        <div id="logo" className="pull-left">
                            <h1><a href="#intro" className="scrollto">PilotIncubator</a></h1>
                            {/* <a href="#intro"><img src={process.env.PUBLIC_URL + "/assets/img/logo.png"} alt="" title="" /></a> */}
                        </div>

                        <nav id="nav-menu-container">
                            <ul className="nav-menu">
                                <li className="menu-active"><a href="#intro">Home</a></li>
                                <li><a href="#about">About Us</a></li>
                                <li className="menu-has-children"><a href="#services">Services</a>
                                    <ul>
                                        <li><a href={window.location.protocol + "//" + window.location.host +"/provider_request"}>Prior Auth Submit</a></li>
                                        <li><a href="#">MIPS Score</a></li>
                                    </ul>
                                </li>
                                <li><a href="#team">Doctors</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>

                {/*-==========================
    Intro Section
  ============================*/}
                <section id="intro">
                    <div className="intro-container">
                        <div id="introCarousel" className="carousel  slide carousel-fade" data-ride="carousel">

                            <ol className="carousel-indicators"></ol>

                            <div className="carousel-inner" role="listbox">

                                <div className="carousel-item active">
                                    <div className="carousel-background"><img src={process.env.PUBLIC_URL + "/assets/img/intro-carousel/1.jpg"} alt="" /></div>
                                    <div className="carousel-container">
                                        <div className="carousel-content">
                                            <h2>We are professional</h2>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.</p>
                                            <a href="#featured-services" className="btn-get-started scrollto">Get Started</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carousel-background"><img src={process.env.PUBLIC_URL + "/assets/img/intro-carousel/2.jpg"} alt="" /></div>
                                    <div className="carousel-container">
                                        <div className="carousel-content">
                                            <h2>At vero eos et accusamus</h2>
                                            <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime
                                              placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
                  quibusdam et aut officiis debitis aut.</p>
                                            <a href="#featured-services" className="btn-get-started scrollto">Get Started</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carousel-background"><img src={process.env.PUBLIC_URL + "/assets/img/intro-carousel/3.jpg"} alt="" /></div>
                                    <div className="carousel-container">
                                        <div className="carousel-content">
                                            <h2>Temporibus autem quibusdam</h2>
                                            <p>Beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                                              aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt omnis iste
                  natus error sit voluptatem accusantium.</p>
                                            <a href="#featured-services" className="btn-get-started scrollto">Get Started</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carousel-background"><img src={process.env.PUBLIC_URL + "/assets/img/intro-carousel/4.jpg"} alt="" /></div>
                                    <div className="carousel-container">
                                        <div className="carousel-content">
                                            <h2>Nam libero tempore</h2>
                                            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
                                              quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut
                  enim ad minima veniam, quis nostrum.</p>
                                            <a href="#featured-services" className="btn-get-started scrollto">Get Started</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carousel-background"><img src={process.env.PUBLIC_URL + "/assets/img/intro-carousel/5.jpg"} alt="" /></div>
                                    <div className="carousel-container">
                                        <div className="carousel-content">
                                            <h2>Magnam aliquam quaerat</h2>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.</p>
                                            <a href="#featured-services" className="btn-get-started scrollto">Get Started</a>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <a className="carousel-control-prev" href="#introCarousel" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon ion-chevron-left" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>

                            <a className="carousel-control-next" href="#introCarousel" role="button" data-slide="next">
                                <span className="carousel-control-next-icon ion-chevron-right" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>

                        </div>
                    </div>
                </section>{/*- #intro */}

                <main id="main">

                    {/*-==========================
      Featured Services Section
    ============================*/}
                    <section id="featured-services">
                        <div className="container">
                            <div className="row">

                                <div className="col-lg-4 box">
                                    <i className="ion-ios-bookmarks-outline"></i>
                                    <h4 className="title"><a href="">Lorem Ipsum Delino</a></h4>
                                    <p className="description">Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
              occaecati cupiditate non provident</p>
                                </div>

                                <div className="col-lg-4 box box-bg">
                                    <i className="ion-ios-stopwatch-outline"></i>
                                    <h4 className="title"><a href="">Dolor Sitema</a></h4>
                                    <p className="description">Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat tarad limino ata</p>
                                </div>

                                <div className="col-lg-4 box">
                                    <i className="ion-ios-heart-outline"></i>
                                    <h4 className="title"><a href="">Sed ut perspiciatis</a></h4>
                                    <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur</p>
                                </div>

                            </div>
                        </div>
                    </section>{/*- #featured-services */}

                    {/*-==========================
      About Us Section
    ============================*/}
                    <section id="about">
                        <div className="container">

                            <header className="section-header">
                                <h3>About Us</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.</p>
                            </header>

                            <div className="row about-cols">

                                <div className="col-md-4 wow fadeInUp">
                                    <div className="about-col">
                                        <div className="img">
                                            <img src={process.env.PUBLIC_URL + "/assets/img/about-mission.jpg"} alt="" className="img-fluid" />
                                            <div className="icon"><i className="ion-ios-speedometer-outline"></i></div>
                                        </div>
                                        <h2 className="title"><a href="#">Our Mission</a></h2>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua. Ut
                                            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
                                    </div>
                                </div>

                                <div className="col-md-4 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="about-col">
                                        <div className="img">
                                            <img src={process.env.PUBLIC_URL + "/assets/img/about-plan.jpg"} alt="" className="img-fluid" />
                                            <div className="icon"><i className="ion-ios-list-outline"></i></div>
                                        </div>
                                        <h2 className="title"><a href="#">Our Plan</a></h2>
                                        <p>
                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem doloremque laudantium, totam rem aperiam,
                                            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
                                    </div>
                                </div>

                                <div className="col-md-4 wow fadeInUp" data-wow-delay="0.2s">
                                    <div className="about-col">
                                        <div className="img">
                                            <img src={process.env.PUBLIC_URL + "/assets/img/about-vision.jpg"} alt="" className="img-fluid" />
                                            <div className="icon"><i className="ion-ios-eye-outline"></i></div>
                                        </div>
                                        <h2 className="title"><a href="#">Our Vision</a></h2>
                                        <p>
                                            Nemo enim ipsam voluptatem quia voluptas sit aut odit aut fugit, sed quia magni dolores eos qui ratione
                                            voluptatem sequi nesciunt Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
              </p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </section>{/*- #about */}

                    {/*-==========================
      Services Section
    ============================*/}
                    <section id="services">
                        <div className="container">

                            <header className="section-header wow fadeInUp">
                                <h3>Services</h3>
                                <p>Laudem latine persequeris id sed, ex fabulas delectus quo. No vel partiendo abhorreant vituperatoribus, ad
                                  pro quaestio laboramus. Ei ubique vivendum pro. At ius nisl accusam lorenta zanos paradigno tridexa
            panatarel.</p>
                            </header>

                            <div className="row">

                                <div className="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
                                    <div className="icon"><i className="ion-ios-analytics-outline"></i></div>
                                    <h4 className="title"><a href="">24 Hour Support</a></h4>
                                    <p className="description">Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
              occaecati cupiditate non provident</p>
                                </div>
                                <div className="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
                                    <div className="icon"><i className="ion-ios-bookmarks-outline"></i></div>
                                    <h4 className="title"><a href="">Medical Counseling</a></h4>
                                    <p className="description">Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat tarad limino ata</p>
                                </div>
                                <div className="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
                                    <div className="icon"><i className="ion-ios-paper-outline"></i></div>
                                    <h4 className="title"><a href="">Emergency Services</a></h4>
                                    <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur</p>
                                </div>
                                <div className="col-lg-4 col-md-6 box wow bounceInUp" data-wow-delay="0.1s" data-wow-duration="1.4s">
                                    <div className="icon"><i className="ion-ios-speedometer-outline"></i></div>
                                    <h4 className="title"><a href="">Premium Healthcare</a></h4>
                                    <p className="description">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum</p>
                                </div>
                                <div className="col-lg-4 col-md-6 box wow bounceInUp" data-wow-delay="0.1s" data-wow-duration="1.4s">
                                    <div className="icon"><i className="ion-ios-barcode-outline"></i></div>
                                    <h4 className="title"><a href="">Nursing Services</a></h4>
                                    <p className="description">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
              voluptatum deleniti atque</p>
                                </div>
                                <div className="col-lg-4 col-md-6 box wow bounceInUp" data-wow-delay="0.1s" data-wow-duration="1.4s">
                                    <div className="icon"><i className="ion-ios-people-outline"></i></div>
                                    <h4 className="title"><a href="">Pharmacy</a></h4>
                                    <p className="description">Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum
              soluta nobis est eligendi</p>
                                </div>

                            </div>

                        </div>
                    </section>{/*- #services */}

                    {/*-==========================
      Call To Action Section
    ============================*/}
                    <section id="call-to-action" className="wow fadeIn">
                        <div className="container text-center">
                            <h3>Call To Action</h3>
                            <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
                            <a className="cta-btn" href="#">Call To Action</a>
                        </div>
                    </section>{/*- #call-to-action */}

                    
                   
                                       {/*-==========================
      Team Section
    ============================*/}
                    <section id="team">
                        <div className="container">
                            <div className="section-header wow fadeInUp">
                                <h3>Doctors</h3>
                                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque</p>
                            </div>

                            <div className="row">

                                <div className="col-lg-3 col-md-6 wow fadeInUp">
                                    <div className="member">
                                        <img src={process.env.PUBLIC_URL + "/assets/img/team-1.jpg"} className="img-fluid" alt="" />
                                        <div className="member-info">
                                            <div className="member-info-content">
                                                <h4>Walter White</h4>
                                                <span>Psychiatrist</span>
                                                <div className="social">
                                                    <a href=""><i className="fa fa-twitter"></i></a>
                                                    <a href=""><i className="fa fa-facebook"></i></a>
                                                    <a href=""><i className="fa fa-google-plus"></i></a>
                                                    <a href=""><i className="fa fa-linkedin"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="member">
                                        <img src={process.env.PUBLIC_URL + "/assets/img/team-2.jpg"} className="img-fluid" alt="" />
                                        <div className="member-info">
                                            <div className="member-info-content">
                                                <h4>Sarah Jhonson</h4>
                                                <span>Cardiologist</span>
                                                <div className="social">
                                                    <a href=""><i className="fa fa-twitter"></i></a>
                                                    <a href=""><i className="fa fa-facebook"></i></a>
                                                    <a href=""><i className="fa fa-google-plus"></i></a>
                                                    <a href=""><i className="fa fa-linkedin"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
                                    <div className="member">
                                        <img src={process.env.PUBLIC_URL + "/assets/img/team-3.jpg"} className="img-fluid" alt="" />
                                        <div className="member-info">
                                            <div className="member-info-content">
                                                <h4>William Anderson</h4>
                                                <span>Cardiologist</span>
                                                <div className="social">
                                                    <a href=""><i className="fa fa-twitter"></i></a>
                                                    <a href=""><i className="fa fa-facebook"></i></a>
                                                    <a href=""><i className="fa fa-google-plus"></i></a>
                                                    <a href=""><i className="fa fa-linkedin"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                                    <div className="member">
                                        <img src={process.env.PUBLIC_URL + "/assets/img/team-4.jpg"} className="img-fluid" alt="" />
                                        <div className="member-info">
                                            <div className="member-info-content">
                                                <h4>Amanda Jepson</h4>
                                                <span>Neurologist</span>
                                                <div className="social">
                                                    <a href=""><i className="fa fa-twitter"></i></a>
                                                    <a href=""><i className="fa fa-facebook"></i></a>
                                                    <a href=""><i className="fa fa-google-plus"></i></a>
                                                    <a href=""><i className="fa fa-linkedin"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </section>{/*- #team */}

                    {/*-==========================
      Contact Section
    ============================*/}
                    <section id="contact" className="section-bg wow fadeInUp">
                        <div className="container">

                            <div className="section-header">
                                <h3>Contact Us</h3>
                                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque</p>
                            </div>

                            <div className="row contact-info">

                                <div className="col-md-4">
                                    <div className="contact-address">
                                        <i className="ion-ios-location-outline"></i>
                                        <h3>Address</h3>
                                        <address>A108 Adam Street, NY 535022, USA</address>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="contact-phone">
                                        <i className="ion-ios-telephone-outline"></i>
                                        <h3>Phone Number</h3>
                                        <p><a href="tel:+155895548855">+1 5589 55488 55</a></p>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="contact-email">
                                        <i className="ion-ios-email-outline"></i>
                                        <h3>Email</h3>
                                        <p><a href="mailto:info@example.com">info@example.com</a></p>
                                    </div>
                                </div>

                            </div>

                            <div className="form">
                                <div id="sendmessage">Your message has been sent. Thank you!</div>
                                <div id="errormessage"></div>
                                <form action="" method="post" role="form" className="contactForm">
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <input type="text" name="name" className="form-control" id="name" placeholder="Your Name"
                                                data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                                            <div className="validation"></div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <input type="email" className="form-control" name="email" id="email" placeholder="Your Email"
                                                data-rule="email" data-msg="Please enter a valid email" />
                                            <div className="validation"></div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject"
                                            data-rule="minlen:4" data-msg="Please enter at least 8 chars of subject" />
                                        <div className="validation"></div>
                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-control" name="message" rows="5" data-rule="required"
                                            data-msg="Please write something for us" placeholder="Message"></textarea>
                                        <div className="validation"></div>
                                    </div>
                                    <div className="text-center"><button type="submit">Send Message</button></div>
                                </form>
                            </div>

                        </div>
                    </section>{/*- #contact */}

                </main>

                {/*-==========================
    Footer
  ============================*/}
                <footer id="footer">
                    <div className="footer-top">
                        <div className="container">
                            <div className="row">

                                <div className="col-lg-3 col-md-6 footer-info">
                                    <h3>PilotIncubator</h3>
                                    <p>Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies
                                      darta donna mare fermentum iaculis eu non diam phasellus. Scelerisque felis imperdiet proin fermentum leo.
              Amet volutpat consequat mauris nunc congue.</p>
                                </div>

                                <div className="col-lg-3 col-md-6 footer-links">
                                    <h4>Useful Links</h4>
                                    <ul>
                                        <li><i className="ion-ios-arrow-right"></i> <a href="#">Home</a></li>
                                        <li><i className="ion-ios-arrow-right"></i> <a href="#">About us</a></li>
                                        <li><i className="ion-ios-arrow-right"></i> <a href="#">Services</a></li>
                                        <li><i className="ion-ios-arrow-right"></i> <a href="#">Terms of service</a></li>
                                        <li><i className="ion-ios-arrow-right"></i> <a href="#">Privacy policy</a></li>
                                    </ul>
                                </div>

                                <div className="col-lg-3 col-md-6 footer-contact">
                                    <h4>Contact Us</h4>
                                    <p>
                                        A108 Adam Street <br />
                                        New York, NY 535022<br />
                                        United States <br />
                                        <strong>Phone:</strong> +1 5589 55488 55<br />
                                        <strong>Email:</strong> info@example.com<br />
                                    </p>

                                    <div className="social-links">
                                        <a href="#" className="twitter"><i className="fa fa-twitter"></i></a>
                                        <a href="#" className="facebook"><i className="fa fa-facebook"></i></a>
                                        <a href="#" className="instagram"><i className="fa fa-instagram"></i></a>
                                        <a href="#" className="google-plus"><i className="fa fa-google-plus"></i></a>
                                        <a href="#" className="linkedin"><i className="fa fa-linkedin"></i></a>
                                    </div>

                                </div>

                                <div className="col-lg-3 col-md-6 footer-newsletter">
                                    <h4>Our Newsletter</h4>
                                    <p>Tamen quem nulla quae legam multos aute sint culpa legam noster magna veniam enim veniam illum dolore
              legam minim quorum culpa amet magna export quem marada parida nodela caramase seza.</p>
                                    <form action="" method="post">
                                        <input type="email" name="email" /><input type="submit" value="Subscribe" />
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="copyright">
                            &copy; Copyright <strong>PilotIncubator</strong>. All Rights Reserved
      </div>
                        <div className="credits">
                            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                        </div>
                    </div>
                </footer>

                <a href="#" className="back-to-top"><i className="fa fa-chevron-up"></i></a>





            </div>)
    }
}

export default Home;