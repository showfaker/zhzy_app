import { MutilService } from './../../../providers/util/Mutil.service';
import { RepairTicketsProvider } from './../../../providers/repair-tickets.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the CommonTeamsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-common-teams',
    templateUrl: 'common-teams.html'
})
export class CommonTeamsPage {
    teams = [];
    name = null;
    searchParams = {
        name: null,
        page: 0,
        size: 10
    };
    page: number;
    canInfinite: boolean;
    selectedTeam: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private repairticketsservice: RepairTicketsProvider,
        private viewCtrl: ViewController,
        private mutilservice: MutilService
    ) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad CommonTeamsPage');
        this.selectedTeam = this.navParams.get('team');
        this.getTeamList(true);
    }

    getTeamList(first, refresher?) {
        if (!refresher) {
            this.mutilservice.showLoading();
        }
        if (first) {
            this.page = 0;
        }
        const params = {
            name: this.name,
            page: this.page,
            size: 10
        };
        this.repairticketsservice.getTeamList(params).subscribe((res) => {
            if (res) {
                this.teams = res.content;
            }
            if (refresher) refresher.complete();
            this.mutilservice.hideLoading();
        });
    }

    clickItem(team) {
        this.viewCtrl.dismiss({
            type: 'ok',
            value: team
        });
    }

    showIcon(id) {
        let selectedTeam = [];
        if (this.selectedTeam) {
            selectedTeam = [this.selectedTeam];
        }
        let index = _.findIndex(selectedTeam, (o) => o.teamId == id);
        return index != -1;
    }

    onCancel() {
        this.getTeamList(true);
    }

    doRefresh(refresher) {
        this.getTeamList(true, refresher);
    }

    doInfinite(infiniteScroll: { complete: () => void }) {
        this.page++;
        let params = {
            name: this.name,
            page: this.page,
            size: 10
        };
        this.repairticketsservice.getTeamList(params).subscribe((res) => {
            if (res && res.content.length > 0) {
                this.teams = this.teams.concat(res['content']);
            } else {
                this.page--;
            }
            if (this.teams.length >= res['totalElements']) {
                this.canInfinite = false;
            }

            infiniteScroll.complete();
        });
    }

    close() {
        this.viewCtrl.dismiss();
    }

    clearAll() {
        this.viewCtrl.dismiss({
            type: 'clear'
        });
    }
}
