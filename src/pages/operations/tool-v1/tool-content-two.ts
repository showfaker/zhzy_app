import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { MeterialCondition } from '../../../models/material.condition';


@Component({
    template: `
     <div class = 'tool-content'>
        <ion-list>
            <div class="find">
                <p>工具名称</p>
                <input placeholder="请输入工具名称关键字" [(ngModel)] = 'name'>
            </div>
        </ion-list>
</div>
<ion-footer>
            <div class="bnt">
                <div class="bnt-left" (click) = resetModel()>重置</div>
                <div class="bnt-left bnt-right" (click) = 'close()'>确定</div>
            </div>
            </ion-footer>
    `
  })
  export class TooltwoPage {
    meterialCondition:MeterialCondition;
    name;
    constructor(
        public viewCtrl: ViewController,
        public navParams : NavParams
    ) {
        this.meterialCondition = this.navParams.get('meterialCondition');
        this.name = this.meterialCondition.name;
    }

    close() {
        this.meterialCondition.name = this.name;
      this.viewCtrl.dismiss(this.meterialCondition);
    }
    resetModel(){
        this.name = null;
    }
  }
