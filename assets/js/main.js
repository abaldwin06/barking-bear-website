/**
* Template Name: Yummy
* Updated: Jan 09 2024 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/yummy-bootstrap-restaurant-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Sticky header on scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll('#navbar a');

  function navbarlinksActive() {
    navbarlinks.forEach(navbarlink => {

      if (!navbarlink.hash) return;

      let section = document.querySelector(navbarlink.hash);
      if (!section) return;

      let position = window.scrollY + 200;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false
    // },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next-1',
      prevEl: '.swiper-button-prev-1',
    }
  });

  /**
   * Init swiper slider with 3 slides at once in desktop view
   */
  new Swiper('.slides-3', {
    speed: 600,
    loop: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false
    // },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      900:
      {
        slidesPerView: 2,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Gallery Slider
   */
  new Swiper('.gallery-slider', {
    speed: 400,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});

class HeadSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TGHNG79N');</script>
    <!-- End Google Tag Manager -->
  
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
  
    <title>Barking Bear Petcare</title>
    <meta content="A small family business providing compassionate dog boarding, daycare, hikes and dog training on a 10 acre dog ranch in Kittredge, CO" name="description">
    <meta content="dog training pet care hikes boarding walks enrichment positive reinforcement mountains kittredge evergreen denver daycare" name="keywords">
  
    <!-- Favicons -->
    <link href="assets/img/BarkingBearFavicon_color.png" rel="icon">
    <link href="assets/img/BarkingBearFavicon_color.png" rel="apple-touch-icon">
  
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Fredoka:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
  
    <!-- Vendor CSS Files -->
    <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <link href="assets/vendor/aos/aos.css" rel="stylesheet">
    <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
    <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">
  
    <!-- Template Main CSS File -->
    <link href="assets/css/main.css" rel="stylesheet">
  
  </head>
    `;
  }
}

class MainHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TGHNG79N"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        
          <!-- ======= Header ======= -->
          <header id="header" class="header fixed-top d-flex align-items-center">
            <script src ="https://form.jotform.com/static/feedback2.js" type="text/javascript"></script>
            <script type="text/javascript">
                var JFL_250718388238062 = new JotformFeedback({
                  formId: '250718388238062',
                  base: 'https://form.jotform.com/',
                  windowTitle: 'Barking Bear Booking / Information Request',
                  backgroundColor: '#776391',
                  fontColor: '#FFFFFF',
                  type: 'false',
                  height: 500,
                  width: 700,
                  openOnLoad: false
                });
            </script>
            <script src='https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'></script>
            <script>window.jotformEmbedHandler("iframe[id='250718388238062']", "https://form.jotform.com/")</script>
            <div class="container-fluid d-flex align-items-center justify-content-between">
        
              <a href="index.html" class="logo d-flex align-items-center me-auto">
                <h1 style="display:none;">Barking Bear Petcare & Dog Training</h1>
                <img src="assets/img/BarkingBearTrainingLogo_color.png" height="100%" alt="Barking Bear PetCare and Dog Training Logo">
              </a>
        
              <nav id="navbar" class="navbar">
                <ul>
                  <li><a href="index.html">Home</a></li>
                  <li><a href="boarding.html">Boarding</a></li>
                  <li><a href="training.html">Training</a></li>
                  <li><a href="hiking.html">Hiking</a></li>
                  <li class="dropdown"><a href="#about"><span>About Us</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
                    <ul>
                      <li><a href="#testimonials">Testimonials</a></li>
                      <li><a href="#services">Services</a></li>
                      <li><a href="#team">Meet the Family</a></li>
                    </ul>
                </ul>
              </nav><!-- navbar -->
        
              <a class="btn-book-with-us lightbox-250718388238062">Book with us</a> <!--TODO: THIS BUTTON NOT WORKING-->
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

customElements.define('head-section', HeadSection);
customElements.define('main-header', MainHeader);
customElements.define('main-footer',MainFooter);