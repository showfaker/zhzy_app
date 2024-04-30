import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'defect-manage',
    templateUrl: 'operate-task.html'
})
export class OperateTask {
    qxkind = false;
    qxstate = false;
    others = false;
    heroes = [];
    constructor(public navCtrl: NavController) {
        this.heroes = [
            { name: '土建类', id: 1, checked: false },
            { name: '安装类', id: 2, checked: false },
            { name: '施工、设备类', id: 3, checked: false },
            { name: '施工类', id: 4, checked: false },
            { name: '清洗系统', id: 5, checked: false },
            { name: '设别类', id: 6, checked: false }
        ];
    }

    //电站筛选
    toPowerStation() {
        // this.navCtrl.push(PowerStation);
    }
    //缺陷类别
    qxkindtoggle() {
        this.qxkind = !this.qxkind;
        this.qxstate = false;
        this.others = false;
    }
    //物料类别
    qxstatetoggle() {
        this.qxstate = !this.qxstate;
        this.qxkind = false;
        this.others = false;
    }
    //其他
    othertoggle() {
        this.others = !this.others;
        this.qxkind = false;
        this.qxstate = false;
    }
    //弹框消失
    masktoggle() {
        this.qxkind = false;
        this.qxstate = false;
        this.others = false;
    }
    checkCraft(id) {
        for (let i = 0; i < this.heroes.length; i++) {
            if (this.heroes[i].id == id) {
                this.heroes[i].checked = !this.heroes[i].checked;
            }
        }
    }
}
