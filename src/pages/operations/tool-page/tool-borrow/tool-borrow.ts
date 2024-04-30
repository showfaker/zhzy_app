import { Component } from "@angular/core";
import { ComponentsUtil } from "../../../../util/components.util";
import { NavController } from "ionic-angular";

@Component({
    selector: 'tool-borrow',
    templateUrl: 'tool-borrow.html'
})
export class ToolBorrow{
    constructor(
        public util: ComponentsUtil,
        public navCtrl : NavController
    ){
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
        this.navCtrl.pop();
    }
}