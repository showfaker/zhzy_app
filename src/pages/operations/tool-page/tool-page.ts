import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CheckWarehouse } from '../../modal/check-warehouse/check-warehouse';
import { SearchWarehouse } from '../../modal/search-warehouse/search-warehouse';
import { ToolBorrow } from './tool-borrow/tool-borrow';
import { ToolReturn } from './tool-return/tool-return';

@Component({
    selector: 'tool-page',
    templateUrl: 'tool-page.html'
})
export class ToolPage {
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
        let searchModal = this.modalCtrl.create(SearchWarehouse, { type: "02" });
        searchModal.present();
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
    //借用
    toBorrow(){
        this.navCtrl.push(ToolBorrow);
    }
    //归还
    toReturn(){
        this.navCtrl.push(ToolReturn);
    }
}


