import { RunLogService } from "./../../../../providers/runlog.service";
import { RunlogReq } from "./../../../../models/runlog-req";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { Component } from "@angular/core";
import { NavController, Events } from "ionic-angular";
import { MutilService } from "../../../../providers/util/Mutil.service";
import { ActionSheetController } from "ionic-angular/components/action-sheet/action-sheet-controller";
import { ConstantsService } from "../../../../providers/util/constants.service";
import { DeviceModel as DeviceModelPage } from "../../../common/deviceModel/device-model";

@Component({
  selector: "new-log",
  templateUrl: "edit-log.html"
})
export class EditLog {
  ders: {}[] = [
    { value: "NE", name: "东北" },
    { value: "ENE", name: "东东北" },
    { value: "E", name: "东" },
    { value: "ESE", name: "东东南" },
    { value: "SE", name: "东南" },
    { value: "SSE", name: "南东南" },
    { value: "S", name: "南" },
    { value: "SSW", name: "南西南" },
    { value: "SW", name: "西南" },
    { value: "WSW", name: "西西南" },
    { value: "W", name: "西" },
    { value: "WNW", name: "西西北" },
    { value: "NW", name: "西北" },
    { value: "NNW", name: "北西北" },
    { value: "N", name: "北" },
    { value: "NNE", name: "北东北" }
  ];

  runlog: RunlogReq = {};
  prevlog: RunlogReq = {};
  yesterdayMsg;
  viewOnly: boolean = false;
  loadFlag: boolean;
  recordId: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public runLogService: RunLogService,
    public events: Events,
    public mutilService: MutilService,
    public actionsheetCtrl: ActionSheetController,
    public constantsService: ConstantsService
  ) {
    this.viewOnly = navParams.get("viewOnly");
    // this.viewOnly = false;
    this.runlog = navParams.get("runlog");
    this.runLogService.logDetail(this.runlog.recordId).subscribe(e => {
      this.runlog = e || {};
      for (let jobRecordLoss of this.runlog.jobRecordLosses) {
        if (jobRecordLoss.startTime) {
          jobRecordLoss.start_time =
            (new Date(jobRecordLoss.startTime).getHours() < 10
              ? "0" + new Date(jobRecordLoss.startTime).getHours()
              : new Date(jobRecordLoss.startTime).getHours()) +
            ":" +
            (new Date(jobRecordLoss.startTime).getMinutes() < 10
              ? "0" + new Date(jobRecordLoss.startTime).getMinutes()
              : new Date(jobRecordLoss.startTime).getMinutes());
        }
        if (jobRecordLoss.endTime) {
          jobRecordLoss.end_time =
            (new Date(jobRecordLoss.endTime).getHours() < 10
              ? "0" + new Date(jobRecordLoss.endTime).getHours()
              : new Date(jobRecordLoss.endTime).getHours()) +
            ":" +
            (new Date(jobRecordLoss.endTime).getMinutes() < 10
              ? "0" + new Date(jobRecordLoss.startTime).getMinutes()
              : new Date(jobRecordLoss.startTime).getMinutes());
        }
        if (jobRecordLoss.recordId) {
          this.recordId = jobRecordLoss.recordId;
        }
      }
    });

    this.runLogService
      .prevLogDetail(this.runlog.stationId, this.runlog.reportDate)
      .subscribe(e => {
        this.yesterdayMsg = e;
        this.prevlog = e.lastJobRecord || {};
      });
    this.events.subscribe("deviceModelSelect", e => {
      if (e) {
        this.loadFlag = true;
        console.log(this.runlog.jobRecordLosses);

        this.runlog.jobRecordLosses[e.index]["deviceName"] = e.deviceName;
        this.runlog.jobRecordLosses[e.index]["deviceId"] = e.deviceId;
      }
    });
  }
  public showPage = 1;
  public get generating() {
    return this.showPage == 1;
  }
  public get powerCut() {
    return this.showPage == 2;
  }
  public get weather() {
    return this.showPage == 3;
  }

  ionViewWillEnter() {}

  /**
   * 下一页
   */
  public next() {
    if (!this.viewOnly) {
      if (this.showPage == 1 && this.firstVerification() !== true) {
        //验证第一页数据是否正确
        console.log(this.firstVerification() + "不能为空");
        this.mutilService.customAlert({
          msg: this.firstVerification() + "不能为空"
        });
        return;
      } else if (this.showPage == 2 && this.secondVerification() !== true) {
        //验证第二页数据是否正确
        console.log(this.secondVerification() + "不能为空");
        this.mutilService.customAlert({
          msg: this.secondVerification() + "不能为空"
        });
        return;
      } else if (this.showPage == 3 && this.thirdVerification() !== true) {
        //验证第三页数据是否正确
        console.log(this.thirdVerification() + "不能为空");
        this.mutilService.customAlert({
          msg: this.thirdVerification() + "不能为空"
        });
        return;
      }
    }

    let nextPage = this.showPage + 1;
    if (nextPage > 3) {
      if (this.viewOnly) {
        this.navCtrl.pop();
      } else {
        this.runLogService.updateLog(this.runlog).subscribe(res => {
          this.events.publish("RunLogUpdate", res);
          this.navCtrl.pop();
        });
      }
    } else {
      this.showPage = nextPage;
    }
  }
  /**
   * 上一页
   */
  public prev() {
    let prevPage = this.showPage - 1;
    if (prevPage < 1) {
      this.navCtrl.pop();
    } else {
      this.showPage = prevPage;
    }
  }

  /***************************************************************************** 页面展示值 *************************************/
  meterValueChange() {
    this.runlog.dailyEnergy =
      (this.runlog.meterValue - this.getYesterdayMeterValue) *
      this.runlog.meterRatio;
  }
  //昨日计量表示值（默认上一条数据）
  get getYesterdayMeterValue() {
    return this.prevlog["meterValue"] || 0;
  }
  //今日上网电量(KWh)
  get getDailyEnergy() {
    return (
      (this.runlog.meterValue - this.getYesterdayMeterValue) *
      this.runlog.meterRatio
    );
  }
  //今日每MW上网电量(KWh)
  get getDailyEnergyMW() {
    return (
      (this.getDailyEnergy &&
        this.getDailyEnergy / this.runlog.parallelCapacity) ||
      0
    );
  }
  //本月上网电量(KWh)
  get getMouthEnergy() {
    return (
      parseFloat((this.yesterdayMsg && this.yesterdayMsg["monthEnergy"]) || 0) +
      this.getDailyEnergy
    );
  }
  getWindDirection() {
    for (let dir of this.ders) {
      if (this.runlog.windDirection == dir["value"]) {
        return dir["name"];
      }
    }
    this.runlog.windDirection = this.ders[0]["value"];
    return (this.runlog.windDirection = this.ders[0]["name"]);
  }
  /***************************************************************************** 结束 ****************************************************/

  //验证第一页数据是否正确
  firstVerification() {
    if (
      !this.runlog.meterRatio ||
      this.decimalNum(parseInt(this.runlog.meterRatio.toString())) != 0
    ) {
      return "电表倍率";
    }
    if (
      !this.runlog.parallelCapacity ||
      this.decimalNum(this.runlog.parallelCapacity) > 6
    ) {
      return "当前并网装机容量";
    }
    if (this.runlog.meterValue && this.decimalNum(this.runlog.meterValue) > 2) {
      return "今日计量表示值";
    }
    if (this.runlog.maxPower && this.decimalNum(this.runlog.maxPower) == 9999) {
      return "今日最大负荷";
    }
    return true;
  }

  //验证第二页数据是否正确
  secondVerification() {
    if (this.runlog.jobRecordLosses && this.runlog.jobRecordLosses.length > 0) {
      let now = new Date();
      let date =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      for (let jobRecordLoss of this.runlog.jobRecordLosses) {
        jobRecordLoss.recordId = this.recordId;
        if (!jobRecordLoss.lossType) {
          return "损失类别";
        }
        if (!jobRecordLoss.start_time) {
          return "停电开始时间";
        } else {
          jobRecordLoss.startTime = new Date(
            date + " " + jobRecordLoss.start_time
          );
        }
        if (jobRecordLoss.end_time) {
          jobRecordLoss.endTime = new Date(date + " " + jobRecordLoss.end_time);
        }
        if (
          !jobRecordLoss.lossEnergy ||
          (jobRecordLoss.lossEnergy &&
            this.decimalNum(jobRecordLoss.lossEnergy) > 4)
        ) {
          return "约损失电量";
        }
      }
    }
    return true;
  }

  //验证第三页数据是否正确
  thirdVerification() {
    if (
      this.runlog.irradiation &&
      this.decimalNum(this.runlog.irradiation) > 2
    ) {
      return "日辐照量";
    }
    if (!this.runlog.weatherInfo || this.runlog.weatherInfo.length > 100) {
      return "今日天气";
    }
    if (this.runlog.maxTemp && this.decimalNum(this.runlog.maxTemp) > 2) {
      return "最高温度";
    }
    if (this.runlog.minTemp && this.decimalNum(this.runlog.minTemp) > 2) {
      return "最低温度";
    }
    if (this.runlog.windSpeed && this.decimalNum(this.runlog.windSpeed) > 2) {
      return "风速";
    }
    if (
      this.runlog.genHoursFine &&
      this.decimalNum(this.runlog.genHoursFine) > 2
    ) {
      return "晴天时长";
    }
    if (
      this.runlog.genHoursPcloud &&
      this.decimalNum(this.runlog.genHoursPcloud) > 2
    ) {
      return "少云时长";
    }
    if (
      this.runlog.genHoursCloudy &&
      this.decimalNum(this.runlog.genHoursCloudy) > 2
    ) {
      return "多云时长";
    }
    if (
      this.runlog.genHoursWet &&
      this.decimalNum(this.runlog.genHoursWet) > 2
    ) {
      return "阴霾时长";
    }
    if (
      this.runlog.genHoursRain &&
      this.decimalNum(this.runlog.genHoursRain) > 2
    ) {
      return "雨雪时长";
    }
    if (this.runlog.genHours && this.decimalNum(this.runlog.genHours) > 2) {
      return "设备运行时长";
    }

    return true;
  }

  //判断有几位小数
  decimalNum(num) {
    if (isNaN(num) || num.toString().split(".").length > 2) return 9999;
    if (num.toString().split(".").length == 1) return 0;
    return num.toString().split(".")[1].length;
  }
  openMenu() {
    let buttons = [];
    for (let dir of this.ders) {
      buttons.push({
        text: dir["name"],
        handler: () => {
          this.runlog.windDirection = dir["value"];
        }
      });
    }
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: "action-sheets-basic-page",
      buttons: buttons
    });
    actionSheet.present();
  }

  /**
   * 天气选择
   */
  weatherInfo() {
    if (this.viewOnly) {
      return;
    }
    this.constantsService.weatherInfo(e => {
      this.runlog.weatherInfo = e.propValue;
      this.runlog.weatherInfoName = e.propName;
      console.log(e);
    });
  }

  /**
   * 损失类别选择
   */
  getLossTypes(index) {
    this.constantsService.lossType(e => {
      this.runlog.jobRecordLosses[index]["lossType"] = e.propValue;
      this.runlog.jobRecordLosses[index]["lossTypeText"] = e.propName;
    });
  }

  equipment(index, deviceName) {
    if (this.runlog.stationId) {
      this.navCtrl.push(DeviceModelPage, {
        stationId: this.runlog.stationId,
        index,
        deviceName
      });
    } else {
      this.mutilService.customAlert({ msg: "请先选择电站!" });
    }
  }

  deleteRecordLoss(index) {
    this.runlog.jobRecordLosses.splice(index, 1);
  }

  addRecordLoss() {
    if (this.runlog.jobRecordLosses == undefined) {
      this.runlog.jobRecordLosses = [];
    }
    this.runlog.jobRecordLosses.push({});
  }
}
