import {templates, select, classNames} from '../settings.js';
import utils from '../utils.js';


class Home{
  constructor(element){
    const thisHome = this;
    thisHome.render(element);
    thisHome.activePage();
    thisHome.initWidgets();
  }

  render(element){
    const thisHome = this;
    const generatedHTML = templates.HomePage();
    thisHome.dom={};
    thisHome.dom.wrapper = element;
    
    // thisHome.dom.wrapper.innerHTML=generatedHTML;
    const homeElement = utils.createDOMFromHTML(generatedHTML);
    thisHome.dom.wrapper.appendChild(homeElement);
    thisHome.dom.linkOrder = element.querySelector(select.nav.homeLinkOrder);
    thisHome.dom.linkBooking = element.querySelector(select.nav.homeLinkBooking);
    thisHome.dom.pageOrder = document.querySelector(select.containerOf.pageOrder);
    thisHome.dom.pageBooking = document.querySelector(select.containerOf.pageBooking);
    thisHome.dom.pageHome = document.querySelector(select.containerOf.pageHome);
    thisHome.dom.carousel = document.querySelector(select.containerOf.carousel);
    console.log(thisHome.dom.carousel);
  }

  activePage() {
    const thisHome = this;
    thisHome.dom.linkOrder.addEventListener('click', function (event) {
      event.preventDefault();
      thisHome.dom.pageOrder.classList.add(classNames.pages.active);
      thisHome.dom.pageHome.classList.remove(classNames.pages.active);
      document.querySelector('.main-nav [href="#order"]').classList.add(classNames.nav.active);
      document.querySelector('.main-nav [href="#home"]').classList.remove(classNames.nav.active);
    });

    thisHome.dom.linkBooking.addEventListener('click', function (event) {
      event.preventDefault();
      thisHome.dom.pageBooking.classList.add(classNames.pages.active);
      thisHome.dom.pageHome.classList.remove(classNames.pages.active);
      document.querySelector('.main-nav [href="#booking"]').classList.add(classNames.nav.active);
      document.querySelector('.main-nav [href="#home"]').classList.remove(classNames.nav.active);
    });

  }

  initWidgets(){
    const thisHome = this;
    const flkty = new Flickity(thisHome.dom.carousel, {
      // options
      cellAlign: 'left',
      contain: true,
    });
    flkty.playPlayer();
  }
}

export default Home;