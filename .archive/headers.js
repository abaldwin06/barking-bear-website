// class HeadSection extends HTMLElement {
  //   connectedCallback() {
  //     this.innerHTML = `<iframe id="HeadSection" src="./assets/templates/main-head.html"></iframe>`
  //   }
  // }
  
  class MainHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TGHNG79N"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<header>
  <style>.header .logo img {
    height: var(--header-height);
    margin-right: 6px;
    margin-left: 1.8rem;
  }</style>
  <div class="container-fluid d-flex align-items-center justify-content-between">

    <a href="index.html" class="logo d-flex align-items-center me-auto">
      <h1 style="display:none;">Barking Bear Petcare & Dog Training</h1>
      <img src="assets/img/BarkingBearTrainingLogo_color.png" alt="Barking Bear PetCare and Dog Training Logo">
    </a>

    <nav id="navbar" class="navbar">
      <ul>
        <li><a href="./index.html">Home</a></li>
        <li><a href="./boarding.html">Boarding</a></li>
        <li><a href="./training.html">Training</a></li>
        <li class="dropdown"><a href="./hiking.html"><span>Hiking</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
          <ul>
            <li><a href="./hiking.html#pack-hikes">Pack Hikes</a></li>
            <li><a href="./hiking.html#training-hikes">Training Hikes</a></li>
          </ul>
        </li>
        <li class="dropdown"><a href="./daycare.html"><span>Day Care</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
          <ul>
            <li><a href="./daycare.html#day-camp">Day Camp</a></li>
            <li><a href="./daycare.html#day-school">Day School</a></li>
          </ul>
        </li>
        <li class="dropdown"><a href="./index.html#why-us"><span>About Us</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
          <ul>
            <li><a href="./index.html#why-us">Why Barking Bear</a></li>
            <li><a href="./index.html#testimonials">Testimonials</a></li>
            <li><a href="./index.html#team">Meet the Family</a></li>
          </ul>
        </li>
      </ul>
    </nav><!-- navbar -->

    <a class="btn-book-with-us">Book with us</a> <!--TODO: THIS BUTTON NOT WORKING-->
    <i class="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
    <i class="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>

  </div>
</header><!-- End Header -->
`
    }
  }
  
  class MainFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
  <footer id="footer" class="footer">
  
  <div class="container">
    <div class="row gy-3 d-flex justify-content-around justify-items-around">
      <div class="col-lg-3 col-5 d-flex">
        <i class="bi bi-geo-alt icon"></i>
        <div>
          <h4>Location</h4>
          <p>
            Kittredge, CO 80457<br>
            Near Lair of the Bear Park
          </p>
        </div>
  
      </div>
  
      <div class="col-lg-3 col-5 footer-links d-flex">
        <i class="bi bi-telephone icon"></i>
        <div>
          <h4>Contact</h4>
          <p>
            <strong>Phone:</strong><br> (505) 550-8171<br>
            <strong>Email:</strong><br> barkingbearpetcare@gmail.com<br>
          </p>
        </div>
      </div>
  
      <div class="col-lg-3 col-5 footer-links d-flex">
        <i class="bi bi-pin-map-fill icon"></i>
        <div>
          <h4>Service Area for Pickup/Dropoff</h4>
          <p>
            Evergreen, Golden, Conifer,<br>
            Arvada, Edgewater, Lakewood,<br>
            Littleton, Englewood,<br>
            Denver Metro (W of Colorado)
          </p>
        </div>
      </div>
  
      <div class="col-lg-3 col-5 footer-links">
        <h4>Follow Us</h4>
        <div class="social-links d-flex">
          <a href="https://www.instagram.com/barkingbear_co/" class="instagram"><i class="bi bi-instagram"></i></a>
          <a href="https://www.instagram.com/barkingbear_co/" class="link-text">@barkingbear_co</a>
        </div>
      </div>
  
    </div>
  </div>
  
  <div class="container">
    <div class="copyright">
      &copy; Copyright <strong><span>Barking Bear Pet Care</span></strong>. All Rights Reserved
    </div>
    
  </div>
  
  </footer>  <!-- End Footer -->`
    }
  }
  
  // customElements.define('head-section', HeadSection);
  customElements.define('main-header', MainHeader);
  customElements.define('main-footer',MainFooter);
