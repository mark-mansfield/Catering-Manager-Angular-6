import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../models/order.model';

import { OrderService } from '../../services/order.service';
import { DishService } from '../../services/dish.service';
@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  order: Order;
  itemsOnMenu: any = [];
  notes: string;
  orderNumber = Math.floor(1000 + Math.random() * 9000);
  form: FormGroup;
  submitted = false;
  isLoading = false;
  dishes: any = [];

  menus = ['rosh hashanah', 'menu 2', 'menu 3'];
  eventOptions = ['pick up', 'delivery service', 'staffed event'];
  deliveryTimeOptions = ['10.30am', '11.00am', '11.30am', '4.30pm', '5.00pm', '5.30pm'];
  pickupTimeOptions = ['3.30pm', '4.00pm', '4.30pm', '5.00pm'];
  eventStartTimeOptions = [
    '9.00am',
    '9.30am',
    '10.00am',
    '10.30am',
    '11.00am',
    '11.30am',
    '12.00pam',
    '12.30pn',
    '1.00pm',
    '2.00pm',
    '2.30pm',
    '3.00pm',
    '3.30pm',
    '4.00pm',
    '4.30pm',
    '5.00pm',
    '5.30pm',
    '6.00pm'
  ];
  stylingOptions = ['none', '$', '$$$', '$$$$$'];

  deliveryTimeSelected = null;
  pickUpTimeSelected = null;
  deliveryAddress = null;
  pickUpDateSelected = null;
  stylePackage = null;
  eventStartTime = null;

  pickUp: boolean;
  delivery: boolean;
  staffed: boolean;
  limitedPickUpDates: boolean;
  styling: boolean;
  menu = {
    _id: '5b8aa5ff78bf462cbfab5903',
    title: 'rosh hashanah',
    description: 'aaaaa',
    limitedPickUpDates: false,
    items: [
      {
        name: 'Slow_Cooked_Lamb_Shoulder',
        description: 'Hawaiij spices, pomegranate molasses, honey and lemon w coriander and almonds',
        portion_sizes: [0, 1, 2, 3],
        course: 'main'
      },
      {
        name: 'Grilled_Ora_king_salmon',
        description: 'chermoula marinade, cherry tomato and green bean salsa',
        portion_sizes: [0, 1, 2, 3],
        course: 'main'
      },
      {
        name: 'Ocean_trout_tarator',
        description: 'w tahini yoghurt, coriander, sumac and chilli',
        portion_sizes: [0, 1, 2, 3],
        course: 'main'
      },
      {
        name: 'Slow_Braised_Free_Range_Chicken',
        description: 'Jerusalem artichokes, bay, lemon, olives, eschallots , dates (Legs and thighs- 18 pieces)',
        portion_sizes: [0, 1],
        course: 'main'
      },
      {
        name: 'chopped_liver',
        description: 'w caramelised onions egg &amp; herb mayo',
        portion_sizes: ['0', '250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'hommus',
        description: "Lox's famous chick pea hummus used at the restaurant",
        portion_sizes: ['0', '250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'confit_tuna',
        description: 'Olive oil, caper and parsley dip',
        portion_sizes: ['0', '250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'Romanian_eggplant',
        description: 'roasted eggplant, capsicum, pomegranate, dill, lemon, shallot)',
        portion_sizes: ['250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'holmbrae_chicken_and_vegetable ',
        description: 'DF',
        portion_sizes: ['250', '500', '1kg'],
        course: 'soup'
      }
    ],
    imagePath: 'http://localhost:3000/images/rosh-hashanah-1552960275177.jpg',
    creator: '5b89d99441204620fb7fa0d4',
    __v: 0
  };
  constructor(public orderService: OrderService, public dishService: DishService, private formBuilder: FormBuilder) {}

  @Output() navigationBack = new EventEmitter<boolean>();

  navigateBack() {
    this.navigationBack.emit(true);
  }

  ngOnInit() {
    this.pickUp = false;
    this.delivery = false;
    this.staffed = false;
    this.styling = false;

    this.limitedPickUpDates = this.menu.limitedPickUpDates;
    this.form = this.formBuilder.group({
      contactName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      notes: ['', [Validators.pattern('[a-zA-Z0-9 .]*')]],
      address: ['', [Validators.pattern('[a-zA-Z0-9 ./-]*')]]
    });

    this.dishes = this.menu.items;
    this.menu.items.forEach(item => {
      const orderItem = {
        name: item.name,
        qty: ''
      };
      this.itemsOnMenu.push(orderItem);
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  updateItemQty(index, item) {
    this.itemsOnMenu[index].qty = item;
    console.log(this.itemsOnMenu[index]);
  }

  onSelectEventType(item) {
    if (item === 'pick up') {
      this.pickUp = true;
      this.delivery = false;
      this.staffed = false;
    } else if (item === 'delivery service') {
      this.pickUp = false;
      this.staffed = false;
      this.delivery = true;
    } else if (item === 'staffed event') {
      this.staffed = true;
      this.delivery = false;
      this.pickUp = false;
    }

    console.log(`Event type is a ${item} event`);
  }

  onUpdateDeliveryAddress(item) {
    console.log(item);
    this.deliveryAddress = item;
    console.log(`Delivery Address ${this.deliveryAddress}`);
  }

  onSelectDeliveryTime(time) {
    this.deliveryTimeSelected = time;
    console.log(`Delivery time se;ected ${this.deliveryTimeSelected}`);
  }

  onSelectPickUpTime(time) {
    this.pickUpTimeSelected = time;
    console.log(`pick up time : ${this.pickUpTimeSelected}`);
  }

  onSelectEventStartTime(time) {
    this.eventStartTime = time;
    console.log(`event start time ${time}`);
  }
  onSelectStylingOption(option) {
    // this.stylePackage = option;
    console.log(`stying package selected ${option}`);
  }

  onSaveOrder() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form);
      console.log('form is invalid');
      return;
    }

    // start spinner
    this.isLoading = true;
    this.order = {
      menuName: 'test-menu',
      customerDetails: {
        contactName: this.form.value.contactName,
        email: this.form.value.email,
        orderNum: this.orderNumber,
        contactNum: this.form.value.phone,
        pickUpDay: 'not-set',
        pickUpTime: 'not-set'
      },
      eventDetails: {
        deliveryTimeSelected: this.deliveryTimeSelected,
        pickUpTimeSelected: this.pickUpTimeSelected,
        deliveryAddress: this.deliveryAddress,
        pickUpDateSelected: this.pickUpDateSelected,
        stylePackage: this.stylePackage,
        eventStartTime: this.eventStartTime
      },
      orderedItems: this.itemsOnMenu,
      notes: this.form.value.notes,
      _id: null,
      __v: null
    };
    console.log(this.order); // this.form.reset();
  }
}
