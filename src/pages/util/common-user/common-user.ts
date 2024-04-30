import { UserService } from './../../../providers/user.servicer';
import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ViewController,
    ModalController,
    Events
} from 'ionic-angular';
import * as _ from 'lodash';
import { SelectedUserListPage } from './selected-user-list/selected-user-list';
/**
 * Generated class for the CommonUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-common-user',
    templateUrl: 'common-user.html'
})
export class CommonUserPage {
    page: any = 0;
    userList: any;
    inputValue: any = null;
    canInfinite: boolean = true;
    isSingle: any;
    hiddenSelectedModal = true;
    selectedItem = [];
    modal: any;
    editable: any;
    /* 230704 关闭滚动刷新 -- START */
    closeInfinite: boolean = true;;
    /* 230704 关闭滚动刷新 -- END */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private userservice: UserService,
        private viewCtrl: ViewController,
        private modalCtrl: ModalController,
        private events: Events
    ) {
        this.events.subscribe('user:item', (res) => {
            this.selectedItem = res;
            document.getElementById('count').innerText = res.length;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CommonUserPage');
        this.isSingle = this.navParams.get('isSingle');
        this.selectedItem = this.navParams.get('selectedItem') || [];
        this.editable = this.navParams.get('editable') === false ? false : true;
        this.getUserList(true);
    }

    searchUser(event) {
        this.userList = [];
        this.page = 0;
        this.inputValue = event.target.value;
        this.getUserList(true);
    }

    getUserList(first, refresher?) {
        if (first) {
            this.page = 0;
        }
        const params = {
            name: this.inputValue,
            page: this.page,
            size: 10
        };
        this.userservice.getUserList({ ...params }).subscribe((res) => {
            if (res) {
                this.userList = res.content;
            }
            if (refresher) refresher.complete();
        });
    }

    doRefresh(refresher: { complete: () => void }) {
        this.getUserList(true, refresher);
    }

    doInfinite(infiniteScroll: { complete: () => void }) {
        if (!this.closeInfinite) {
            return;
        }
        this.page++;
        let params = {
            name: this.inputValue,
            page: this.page,
            size: 10
        };
        this.userservice.getUserList({ ...params }).subscribe((res) => {
            /* 表明当前数据重复，滚动刷新关闭 */
            if (this.userList.length == res.content.length) {
                this.closeInfinite = false;
                return;
            }
            if (res && res.content.length > 0) {
                this.userList = this.userList.concat(res['content']);
            } else {
                this.page--;
            }
            if (this.userList.length >= res['totalElements']) {
                this.canInfinite = false;
            }

            infiniteScroll.complete();
        });
    }

    close() {
        this.viewCtrl.dismiss(null);
    }

    toggleSelectedItemModal() {
        if (this.hiddenSelectedModal == true) {
            this.modal = this.modalCtrl.create(
                SelectedUserListPage,
                {
                    selectedItem: [...this.selectedItem],
                    editable: this.editable
                },
                {
                    cssClass: 'selectedUserList'
                }
            );
            this.modal.onDidDismiss((data) => {
                if (data === null) {
                    this.hiddenSelectedModal = true;
                }
            });
            this.modal.present();
            this.hiddenSelectedModal = false;
        } else {
            this.modal.dismiss();
            this.hiddenSelectedModal = true;
        }
    }

    commitUser() {
        if (!this.hiddenSelectedModal) {
            this.modal.dismiss();
            this.hiddenSelectedModal = true;
        }
        if (!this.editable) {
            this.viewCtrl.dismiss({ type: 'close' });
            return;
        }
        this.viewCtrl.dismiss({ value: this.selectedItem, type: 'ok' });
    }

    clear() {
        this.viewCtrl.dismiss({ value: null, type: 'clear' });
    }

    showIcon(userId) {
        let index = _.findIndex(this.selectedItem, (o) => o.userId == userId);
        return index != -1;
    }

    selectUser(user) {
        if (!this.editable) {
            return;
        }
        if (!this.isSingle) {
            let index = _.findIndex(this.selectedItem, (o) => o.userId == user.userId);
            if (index == -1) {
                this.selectedItem.push(user);
            } else {
                this.selectedItem.splice(index, 1);
            }
        } else {
            this.selectedItem = [user];
            this.viewCtrl.dismiss({ value: this.selectedItem, type: 'ok' });
        }
    }
}
