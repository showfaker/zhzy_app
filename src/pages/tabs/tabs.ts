import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../home/home';
import { Operations } from '../operations/operations';
import { MyPage } from '../my/my';
import { MonitorPage } from '../monitor/monitor';
import { Events, Tabs, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('supervisorblock') tabs: Tabs;
    tab1Root = HomePage;
    tab2Root = MonitorPage;
    tab3Root = Operations;
    tab4Root = MyPage;
    tabsParams;

    constructor(
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams
    ) {
        this.tabsParams = { homepage: this.navParams.get('homepage') };
        this.events.subscribe('changerTab', (e) => {
            this.tabs.select(e.index, {}, true);
            if (e.index === 1 && e.stationId) {
                this.tabsParams.stationId = e.stationId;
            }
        });
        /*** 退出登录*/
        this.events.subscribe('login:out', (e) => {
            localStorage.setItem('LOGIN_USER_INFO', JSON.stringify({}));
            this.navCtrl.setRoot(LoginPage);
        });
    }
}
