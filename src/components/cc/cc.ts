import { ModalController } from 'ionic-angular';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonUserPage } from '../../pages/util/common-user/common-user';
import * as _ from 'lodash';

/**
 * Generated class for the CcComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'cc',
    templateUrl: 'cc.html'
})
export class CcComponent implements OnChanges {
    @Input() users = [];
    @Input() ccPermission = 2;
    @Output() public userEvent = new EventEmitter<any>();

    constructor(private modalCtrl: ModalController) {
        console.log('Hello CcComponent Component');
        console.log(this.users);
    }

    ngOnChanges(changes) {
        console.log(changes.users);
        // if(changes.users&&changes.users.currentV){

        // }
    }

    addUser() {
        const selectedItem = [];
        this.users.map((item) => {
            selectedItem.push({
                userId: item['userId'],
                realName: item['userName'],
                icon: item['userIcon']
            });
        });
        const modal = this.modalCtrl.create(CommonUserPage, {
            isSingle: false,
            selectedItem: selectedItem
        });
        modal.onDidDismiss((data) => {
            if (data) {
                if (data.type == 'ok') {
                    this.users = [];
                    data.value.map((item) => {
                        this.users.push({
                            userName: item.realName,
                            userIcon: item.icon,
                            userId: item.userId
                        });
                    });
                    this.userEvent.emit(this.users);
                }
            } else if (data && data.length === 0) {
            }
        });
        modal.present();
    }

    deleteUser(userId) {
        _.remove(this.users, (o) => o.userId === userId);
        this.userEvent.emit(this.users);
    }
}
