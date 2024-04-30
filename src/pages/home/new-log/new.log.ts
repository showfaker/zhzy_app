import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'new-log',
    templateUrl: 'new.log.html'
})
export class NewLog {
    constructor(
        public navCtrl: NavController
    ) {}
    public showPage = 1;
    public get generating() {
        return this.showPage == 1;
    };
    public get powerCut() {
        return this.showPage == 2;
    };
    public get weather() {
        return this.showPage == 3;
    };
    /**
     * 下一页
     */
    public next() {
        if(this.showPage == 1) {
            console.log(1)
        }else if(this.showPage==2) {
            console.log(2)
        }else if(this.showPage == 3) {
            console.log(3)
        }

        if(this.showPage+1 > 3) {
            this.navCtrl.pop();
        }else {
            this.showPage += 1;
        }
    }
    /**
     * 上一页
     */
    public prev() {
        if(this.showPage-1<1) {
            this.navCtrl.pop()
        }else {
            this.showPage -= 1
        }
    }

}