import {templates, select, settings, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.checkStarters();
    thisBooking.selectedTable = null;
    thisBooking.starters = [];
  }

  getData(){
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    
    const params ={
      booking:[
        startDateParam,      
        endDateParam,     
      ],
      eventsCurrent:[
        settings.db.notRepeatParam,
        startDateParam,       
        endDateParam,      
      ],
      eventsRepeat:[
        settings.db.repeatParam,
        endDateParam,
      ],

    };
    // console.log('getData params ', params);

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking +'?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event   +'?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event   +'?' + params.eventsRepeat.join('&'),
    };
    // console.log(urls);

    Promise.all ([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
    
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),

        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);

        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    thisBooking.booked = {};

    for (let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

   
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat){
      if (item.repeat === 'daily'){
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1) ){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    
    // console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;
    if (typeof thisBooking.booked[date]==='undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);
    for(let hourBlock = startHour; hourBlock <startHour + duration; hourBlock += 0.5){
      if (typeof thisBooking.booked[date][hourBlock]==='undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] === 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] === 'undefined'
    ){
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(!allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      }
      else {
        table.classList.remove(classNames.booking.tableBooked);

      }
    }
    thisBooking.unselectTables();
  }

  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom={};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML=generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.starters = document.querySelector(select.booking.starters);
    thisBooking.dom.bookingForm = document.querySelector(select.booking.bookingForm);

    console.log(thisBooking.dom.btnBookTable);
  
  }

  

  initTables(event){
    const thisBooking = this;
    event.preventDefault();
    if ((event.target).classList.contains(classNames.booking.table)){
      const tableActiv = parseInt (event.target.getAttribute ('data-table'));
      if ((event.target).classList.contains(classNames.booking.tableBooked)){
        alert('Sorry, table is already booked!');
      }
      else {
        if(thisBooking.selectedTable===tableActiv){
          thisBooking.unselectTables();
        }
        else{
          thisBooking.unselectTables();
          thisBooking.selectedTable=tableActiv;
          event.target.classList.add(classNames.booking.tableSelected);
        }
      }
    } 
    // console.log(thisBooking.selectedTable); 
    // console.log(thisBooking.date, typeof(thisBooking.date));
    // console.log(thisBooking.hour, typeof(thisBooking.hour));
    // console.log(thisBooking.peopleAmountWidget.correctValue, typeof(thisBooking.peopleAmountWidget.correctValue));
    
  }

  unselectTables(){
    const thisBooking = this;
    for (let table of thisBooking.dom.tables){
      table.classList.remove(classNames.booking.tableSelected);
      thisBooking.selectedTable = null;
    }
    // console.log(thisBooking.selectedTable);
    
  }

  checkStarters(){
    const thisBooking = this;
    thisBooking.dom.starters.addEventListener('click', function (event) {
      const checkboxObject = event.target;
      console.log(checkboxObject.getAttribute('value'));

      //   if (checkboxObject.matches('input[value="adults"]') || checkboxObject.matches('input[value="nonFiction"]'))
      if (checkboxObject.getAttribute('value') === 'water' || checkboxObject.getAttribute('value') ==='bread')

      {
        if (checkboxObject.checked === true && !thisBooking.starters.includes(checkboxObject.getAttribute('value'))){ 
          thisBooking.starters.push(checkboxObject.getAttribute('value'));
        }
        else {
          let index = thisBooking.starters.indexOf(checkboxObject.getAttribute('value'));
          if (index !== -1) {
            thisBooking.starters.splice(index, 1);
          }
        }
      }
      console.log(thisBooking.starters);
    });
  }

  sendBooking() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    const payload = {

      date: thisBooking.date,
      hour: utils.numberToHour(thisBooking.hour),
      table: thisBooking.selectedTable,
      duration: parseInt(thisBooking.hoursAmountWidget.correctValue),
      ppl: parseInt (thisBooking.peopleAmountWidget.correctValue),
      starters: thisBooking.starters,
      address: (thisBooking.dom.address).value,
      phone: (thisBooking.dom.phone).value,
      
    };
    console.log('payload', payload);

      
    // for (let starters of thisBooking.starters) {
    //   payload.starters.push(prod.getData());
    // }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
        thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
        
      });
    thisBooking.updateDOM();
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function () {});
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function () {});
    
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

    thisBooking.dom.floorPlan.addEventListener('click', function (event){
      thisBooking.initTables(event);
    });

    thisBooking.dom.bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  

  }


}

export default Booking;