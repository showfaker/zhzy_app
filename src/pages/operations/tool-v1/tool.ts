import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { ToolonePage } from './tool-content-one';
import { TooltwoPage } from './tool-content-two';
import { MaterialService } from '../../../providers/material.service';
import { MeterialCondition } from '../../../models/material.condition';
import { Meterial } from '../../../models/meterial';

/** 
 * 备件工具列表页面
*/
@Component({
  selector: 'page-tool',
  templateUrl: 'tool.html'
})
export class ToolPageV1 {
  meterialCondition:MeterialCondition = new MeterialCondition();
  meterials:Meterial[];
  constructor(
    public navCtrl: NavController,
    public navParms: NavParams,
    public popoverCtrl: PopoverController,
    public materialService:MaterialService
  ) {
    this.meterialCondition.classType = this.navParms.get('classType');
  }

  
  ionViewWillEnter() {
    this.materialService.getMeterial(this.meterialCondition).subscribe(e=>{
      if (e && e['content'] && e['content'].length>=0) {
        this.meterials = e['content'];
        console.log(this.meterials)
      }
    })
  }
  popover
  presentPopoverOne(type) {
    if (this.popover) {
      this.popover.dismiss()
      return;
    }
    this.popover = this.popoverCtrl.create(ToolonePage,{meterialCondition:this.meterialCondition,type:type},{cssClass: 'tool-content-one'});
    this.popover.onWillDismiss(e=>{
      if (e) {
        this.meterialCondition = e;
        this.ionViewWillEnter();
      }
      this.popover = null
    })
    this.popover.present();
  }
  presentPopoverTwo() {
    if (this.popover) {
      this.popover.dismiss()
     
      return;
    }
    this.popover = this.popoverCtrl.create(TooltwoPage,{meterialCondition:this.meterialCondition},{cssClass: 'tool-content-two'});
    this.popover.onWillDismiss(e=>{
      if (e) {
        this.meterialCondition = e;
        this.ionViewWillEnter();
        
      }
      this.popover = null
    })
    this.popover.present();
  }
}
