import {templates, select} from '../settings.js';
// import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';



class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    console.log(generatedHTML);
    thisBooking.dom={};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML=generatedHTML;

    // /* create element using utils.createElementFromHTML*/
    // const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    // /* add element to menu*/
    // thisBooking.dom.productList.appendChild(generatedDOM);
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function () {});
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function () {});
  }
}


export default Booking;