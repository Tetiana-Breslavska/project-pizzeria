import {templates} from '../settings.js';
// import utils from '../utils.js';



class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    // thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget;
    console.log(generatedHTML);
    thisBooking.dom={};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML=generatedHTML;

    // /* create element using utils.createElementFromHTML*/
    // const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    // /* add element to menu*/
    // thisBooking.dom.productList.appendChild(generatedDOM);

  }

}

export default Booking;