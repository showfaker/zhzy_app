import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NoticeDetails } from '../notice-details/notice.details';

@Component({
    selector: 'notice-list',
    templateUrl: 'notice.list.html'
})
export class NoticeList {
    constructor(
        public navCtrl: NavController
    ) {}
    noticeDetails() {
        this.navCtrl.push(NoticeDetails)
    }
}