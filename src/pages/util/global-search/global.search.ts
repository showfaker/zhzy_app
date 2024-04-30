import { Component } from '@angular/core';
import { ViewController, NavController, Events } from 'ionic-angular';
import { HomeService } from '../../../providers/home.service';
import { EquipmentMessage } from '../../home/equipment-message/equipment.message';
import { PowStaRecords } from '../../monitor/power-station-records/pow.sta.records';

@Component({
    selector: 'global-search',
    templateUrl: 'global.search.html'
})
export class GlobalSearch {
    searResult = 'dianzhan';
    historyRecord = ['xxx电站', 'xxx电站', 'xxx电站', 'xxx电站'];
    pageIndex: number = 0;
    searchInfo: any = [];
    myInput: string;
    constructor(
        private viewCtrl: ViewController,
        public homeService: HomeService,
        public navCtrl: NavController,
        private event: Events
    ) {}

    onInput() {
        let searchType = 'S';
        if (this.searResult == 'dianzhan') {
            searchType = 'S';
        } else if (this.searResult == 'shebei') {
            searchType = 'D';
        } else {
            searchType = 'O';
        }
        this.homeService
            .searchInfo(searchType, this.myInput, this.pageIndex)
            .subscribe((e) => {
                if (e) {
                    this.searchInfo = e.content;
                    console.log(e);
                }
            });
    }

    onCancel() {
        this.viewCtrl.dismiss();
    }

    segmentChanged() {
        this.pageIndex = 0;
        this.onInput();
    }

    doInfinite(infiniteScroll) {
        this.pageIndex++;
        let searchType = 'S';
        if (this.searResult == 'dianzhan') {
            searchType = 'S';
        } else if (this.searResult == 'shebei') {
            searchType = 'D';
        } else {
            searchType = 'O';
        }
        this.homeService
            .searchInfo(searchType, this.myInput, this.pageIndex)
            .subscribe((e) => {
                infiniteScroll.complete();
                if (e) {
                    this.searchInfo.push.apply(this.searchInfo, e.content);
                    console.log(e);
                }
                if (this.searchInfo.length == e.totalElements) {
                    infiniteScroll.enable(false);
                }
            });
    }

    // stationId changed
    stationClick(station) {
        // this.navCtrl.push(PowStaRecords, { stationId: station.id });
        this.onCancel();
        localStorage.setItem('stationId', station.id);
        localStorage.setItem('isFromGlobalSearch', 'true');
        this.event.publish('changerTab', { index: 1 });
    }

    equipmentClick(equipment) {
        this.navCtrl.push(EquipmentMessage, { deviceId: equipment.id });
    }
}
