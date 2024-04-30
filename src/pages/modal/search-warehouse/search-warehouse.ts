import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
    selector: 'search-warehouse',
    templateUrl: 'search-warehouse.html'
})
export class SearchWarehouse {
    constructor(
        public navCtrl: NavController,
        public viewCtrl: ViewController
    ) {
        
    }

    onInput(event){
        console.log(event)
    }
    onCancel(event){
        console.log(event)
    }

    cancel(){
        console.log('cancel')
        this.viewCtrl.dismiss();
    }
}