import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'check-warehouse',
    templateUrl: 'check-warehouse.html'
})
export class CheckWarehouse {
    checkone :boolean =false;
    checktwo :boolean =false;
    checkthree :boolean =false;
    constructor(
        public navCtrl : NavController
    ) {}
    onInput(event){
        console.log(event)
    }
    onCancel(event){
        console.log(event)
    }
    firstChecked(){

    }
    secondChecked(){

    }
    thirdChecked(){

    }
    next(){
        this.navCtrl.pop();
    }
}