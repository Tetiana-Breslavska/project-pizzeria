import {templates} from '../settings.js';
import utils from '../utils.js';
// select, settings, classNames
// import utils from '../utils.js';
// import AmountWidget from './AmountWidget.js';
// import DatePicker from './DatePicker.js';
// import HourPicker from './HourPicker.js';

class Home{
  constructor(element){
    const thisHome = this;
    thisHome.render(element);
    // thisHome.initWidgets();
  }

  render(element){

    const thisHome = this;
    const generatedHTML = templates.HomePage();
    thisHome.dom={};
    thisHome.dom.wrapper = element;
    // thisHome.dom.wrapper.innerHTML=generatedHTML;
    const homeElement = utils.createDOMFromHTML(generatedHTML);
    thisHome.dom.wrapper.appendChild(homeElement);
  }
 
}

export default Home;