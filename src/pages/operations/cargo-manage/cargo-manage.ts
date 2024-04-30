import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CheckWarehouse } from '../../modal/check-warehouse/check-warehouse';
import { SearchWarehouse } from '../../modal/search-warehouse/search-warehouse';
import { CargoOut } from './cargo-out/cargo-out';
import { CargoIn } from './cargo-in/cargo-in';

@Component({
    selector: 'cargo-manage',
    templateUrl: 'cargo-manage.html'
})
export class CargoManage {
    kckind:boolean=false;
    wlkind:boolean=false;
    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController
    ) {
        
    }
    //仓库筛选
    toWarehouse() {
        this.navCtrl.push(CheckWarehouse);
    }
    //查找 TODO
    tomodal(){
        let searchModal = this.modalCtrl.create(SearchWarehouse, { type: "01" });
        searchModal.present();
    }
    //出库
    outPut(){
        this.navCtrl.push(CargoOut);
    }
    //入库
    inPut(){
        this.navCtrl.push(CargoIn);
    }
    //库存类别
    kctoggle(){
        this.kckind = !this.kckind;
        this.wlkind = false;
    }
    //物料类别
    wltoggle(){
        this.wlkind = !this.wlkind;
        this.kckind = false;
    }
    //弹框消失
    masktoggle(){
        this.wlkind = false;
        this.kckind = false;
    }
}