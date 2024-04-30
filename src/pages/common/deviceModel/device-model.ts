import { Events, ViewController } from "ionic-angular";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { BackendService } from "../../../providers/backend.service";
import { EquipmentService } from "../../../providers/equipment.service";

@Component({
  selector: "device-model",
  templateUrl: "device-model.html"
})
export class DeviceModel {
  private equipList: {}[] = [];
  stationId: string; //电站id
  page;
  canInfinite: boolean = true;
  defectDeviceIdsText: string;
  search: string; //查询内容
  searcht; //查询定时
  index: any;
  constructor(
    public navCtrl: NavController,
    public equipmentService: EquipmentService,
    public navParams: NavParams,
    public events: Events
  ) {
    this.stationId = this.navParams.get("stationId");
    this.defectDeviceIdsText = this.navParams.get("deviceName");
    this.index = this.navParams.get("index");
    this.page = 0;
  }

  ionViewWillEnter() {
    this.getequipmentList();
  }

  ionViewWillLeave() {}

  getequipmentList() {
    // let stationIds = '00001';
    this.equipmentService
      .getequipmentListUrl(this.stationId, this.page)
      .subscribe(e => {
        this.equipList = [];
        if (e && e["content"] && e["content"].length > 0) {
          this.equipList = e["content"];
          if (this.defectDeviceIdsText) {
            for (let index = 0; index < this.equipList.length; index++) {
              const element = this.equipList[index];
              element["select"] =
                this.defectDeviceIdsText.indexOf(element["deviceName"]) > -1;
            }
          }
        }
      });
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.equipmentService
      .getequipmentListUrl(this.stationId, this.page)
      .subscribe(e => {
        if (e && e["content"] && e["content"].length > 0) {
          if (this.defectDeviceIdsText) {
            for (let index = 0; index < e["content"].length; index++) {
              const element = e["content"][index];
              element["select"] =
                this.defectDeviceIdsText.indexOf(element["deviceName"]) > -1;
            }
          }
          this.equipList = this.equipList.concat(e["content"]);
        }

        if (this.equipList.length >= e.totalElements) {
          this.canInfinite = false;
        }else {
          this.canInfinite = true;
        }
        infiniteScroll.complete();
      });
  }

  query(e) {
    if (this.searcht) {
      window.clearInterval(this.searcht);
    }
    if (this.search == "" || !this.search) {
      this.page = 0;
      this.getequipmentList();
      return;
    }
    this.searcht = setTimeout(() => {
      this.equipmentService
        .getequipmentListUrl(this.stationId, 0, this.search)
        .subscribe(e => {
          this.equipList = [];
          if (e && e["content"]) {
            this.equipList = e["content"];
          }
        });
    }, 1000 * 1.5);
  }

  select(equ) {
    this.prev();
    equ.select = !equ.select;
  }

  next() {
    let selectDeviceName = "";
    let selectDeviceId = "";
    for (let equip of this.equipList) {
      if (equip["select"]) {
        selectDeviceName = equip["deviceName"];
        selectDeviceId = equip["deviceId"];
      }
    }
    let params = {
      index: this.index,
      deviceName: selectDeviceName,
      deviceId: selectDeviceId
    };

    this.events.publish("deviceModelSelect", params);
    this.navCtrl.pop();
  }
  prev() {
    for (let equip of this.equipList) {
      equip["select"] = false;
    }
  }
}
