import { Component } from "@angular/core";
import { ComponentsUtil } from "../../../../util/components.util";
import { NavController } from "ionic-angular";

@Component({
    selector: 'cargo-out',
    templateUrl: 'cargo-out.html'
})
export class CargoOut{
    outTime : any
    constructor(
        public util: ComponentsUtil,
        public navCtrl : NavController
    ){
        this.outTime = new Date(new Date().getTime()+8*60*60*1000).toISOString();
    }

    sort(){
        this.util.showPopupList({
            buttons :[
                {
                    text :'正常库存',
                    handler : () => {
                        console.log("正常库存")
                    }
                },{
                    text :'异常库存',
                    handler : () => {
                        console.log("异常库存")
                    }
                }
            ]
        })
    }
    next(){
        console.log(this.outTime);
        // this.navCtrl.pop();
    }
}