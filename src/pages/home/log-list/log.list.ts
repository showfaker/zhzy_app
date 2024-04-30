import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewLog } from '../new-log/new.log';

@Component({
    selector: 'log-list',
    templateUrl: 'log.list.html'
})
export class LogList {
    constructor(
        public navCtrl: NavController,
    ) {}
    newLog() {
        this.navCtrl.push(NewLog)
    }
}