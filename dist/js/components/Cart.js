import {settings, select, templates, classNames} from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';


class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    // console.log('new Cart', thisCart);
  }
    
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    // console.log(thisCart.dom.wrapper);
    // console.log(select.cart.toggleTrigger);
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = document.querySelector( select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = document.querySelector( select.cart.subtotalPrice);
    thisCart.dom.totalPrice = document.querySelector(select.cart.totalPrice);
    thisCart.dom.totalPriceTitle = document.querySelector(select.cart.totalPriceTitle);
    thisCart.dom.totalNumber = document.querySelector( select.cart.totalNumber);
    thisCart.dom.form = document.querySelector(select.cart.form);
    thisCart.dom.phone = document.querySelector(select.cart.phone);
    thisCart.dom.address = document.querySelector(select.cart.address);
  }
    
  initActions() {
    const thisCart = this;
    // console.log(thisCart.dom.toggleTrigger);
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      event.preventDefault();
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function () {
      event.preventDefault();
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function () {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  remove(cartProduct){
    const thisCart = this;
    // console.log('remove', cartProduct);
    // console.log(thisCart);
    // console.log(thisCart.products);
    for (let product of thisCart.products) {
      if (product === cartProduct) {
        const index = thisCart.products.indexOf(product);
        console.log(index);
        thisCart.products.splice(index, 1);
      }
    }
    thisCart.update();
    // console.log(cartProduct.dom.wrapper);
    cartProduct.dom.wrapper.remove();
  }

  add(menuProduct) {
    const thisCart = this;
    // console.log(thisCart);
    // console.log('adding product', menuProduct);
    const generatedHTML = templates.cartProduct(menuProduct);
    // console.log(generatedHTML);
    /* create element using utils.createElementFromHTML*/
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /* add element to menu*/
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }

  update(){
    const thisCart = this;
    let deliveryFee = 0;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    thisCart.totalPrice = 0;
    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    if (thisCart.totalNumber != 0) {
      deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
    }
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    thisCart.dom.totalPriceTitle.innerHTML = thisCart.totalPrice;
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.totalNumber.classList.add(classNames.cart.illusion);
    setTimeout(function() {
      thisCart.dom.totalNumber.classList.remove(classNames.cart.illusion);
    }, 500);
    thisCart.dom.totalPriceTitle.classList.add(classNames.cart.illusion);
    setTimeout(function() {
      thisCart.dom.totalPriceTitle.classList.remove(classNames.cart.illusion);
    }, 500);
    thisCart.dom.totalPrice.classList.add(classNames.cart.illusion);
    setTimeout(function() {
      thisCart.dom.totalPrice.classList.remove(classNames.cart.illusion);
    }, 500);

  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {
      address: (thisCart.dom.address).value,
      phone: (thisCart.dom.phone).value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: settings.cart.defaultDeliveryFee,
      products: []
    };
    // console.log('payload', payload);

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
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
      });
  }
}

export default Cart;