import { Component } from "@angular/core";
import { ComponentsUtil } from "../../../../util/components.util";
import { NavController } from "ionic-angular";

@Component({
    selector: 'cargo-in',
    templateUrl: 'cargo-in.html'
})
export class CargoIn{
    showBlack : boolean =false;//库存类别
    cargoSort : string = "选择库存类别";
    myDate :any = {};
    constructor(
        public util: ComponentsUtil,
        public navCtrl : NavController
    ){
        // this.myDate.time = new Date(new Date().getTime()+8*60*60*1000).toISOString();
        this.myDate.time =new Date().toISOString();
    }

    sort(){
        let that =this
        this.util.showPopupList({
            buttons :[
                {
                    text :'正常库存',
                    handler : () => {
                        console.log("正常库存")
                        that.cargoSort = '正常库存';
                        that.showBlack =true;
                    }
                },{
                    text :'异常库存',
                    handler : () => {
                        console.log("异常库存")
                        that.cargoSort = '异常库存';
                        that.showBlack =true;
                    }
                }
            ]
        })
    }
    changeTime(){
        this.myDate = new Date(new Date().getTime()+8*60*60*1000).toISOString();
    }
    next(){
        this.navCtrl.pop();
    }
}