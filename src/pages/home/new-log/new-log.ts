import { Component } from "@angular/core";
import { NavController, Events } from "ionic-angular";
import { RunlogReq } from "../../../models/runlog-req";
import { RunLogService } from "../../../providers/runlog.service";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { MutilService } from "../../../providers/util/Mutil.service";
import { ActionSheetController } from "ionic-angular/components/action-sheet/action-sheet-controller";
import { ConstantsService } from "../../../providers/util/constants.service";
import { DeviceModel as DeviceModelPage } from "../../common/deviceModel/device-model";
@Component({
  selector: "new-NewLogold",
  templateUrl: "new-log.html"
})
export class NewLog_old {
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

  runlogReq: RunlogReq = new RunlogReq();
  station;
  yesterdayMsg;
  loadFlag: boolean;
  constructor(
    public navCtrl: NavController,
    public runLogService: RunLogService,
    public navParams: NavParams,
    public mutilService: MutilService,
    public actionsheetCtrl: ActionSheetController,
    public events: Events,
    public constantsService: ConstantsService
  ) {
    this.station = this.navParams.get("station");
    this.events.subscribe("deviceModelSelect", e => {
      if (e) {
        this.loadFlag = true;
        this.runlogReq.jobRecordLosses[e.index]["deviceName"] = e.deviceName;
        this.runlogReq.jobRecordLosses[e.index]["deviceId"] = e.deviceId;
      }
    });
  }

  ionViewWillEnter() {
    if (!this.loadFlag) {
      this.runLogService
        .prevLogDetail(this.station.stationId, new Date().toISOString())
        .subscribe(e => {
          this.yesterdayMsg = e;
          console.log(e);
          this.runlogReq = new RunlogReq();
          this.initGeneratingValue(e);
        });
    }
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
  /**
   * 下一页
   */
  public next() {
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
    if (this.showPage + 1 > 3) {
      this.add();
      // this.navCtrl.pop();
    } else {
      this.showPage = this.showPage + 1;
    }
  }
  /**
   * 上一页
   */
  public prev() {
    if (this.showPage - 1 < 1) {
      this.navCtrl.pop();
    } else {
      this.showPage = this.showPage - 1;
    }
  }

  add() {
    this.runLogService.addLog(this.runlogReq).subscribe(e => {
      this.events.publish("RunLogUpdate", e);
      this.navCtrl.pop();
      // console.log(e)
    });
  }

  // 初始化第一页数据默认值
  initGeneratingValue(e) {
    this.runlogReq.stationId = this.station.stationId;
    this.runlogReq.meterRatio =
      (e && e["lastJobRecord"] && e["lastJobRecord"]["meterRatio"]) || 1; // 电表倍率 （默认上一条数据）
    this.runlogReq.parallelCapacity =
      (e && e["lastJobRecord"] && e["lastJobRecord"]["parallelCapacity"]) || 1; // 当前并网装机容量(MW) （默认上一条数据）
    this.runlogReq.meterValue =
      (e && e["lastJobRecord"] && e["lastJobRecord"]["meterValue"]) || 0; // 今日计量表示值（默认上一条数据）
    this.runlogReq.genHoursFine = 0;
    this.runlogReq.genHoursPcloud = 0;
    this.runlogReq.genHoursCloudy = 0;
    this.runlogReq.genHoursWet = 0;
    this.runlogReq.genHoursRain = 0;
    this.runlogReq.genHours =
      this.runlogReq.genHoursFine +
      this.runlogReq.genHoursPcloud +
      this.runlogReq.genHoursCloudy +
      this.runlogReq.genHoursWet +
      this.runlogReq.genHoursRain;
    this.runlogReq.recordType = "01";
    this.runlogReq.windDirection = "0";
    this.runlogReq.reportDate = new Date().toISOString();
    this.runlogReq.jobRecordLosses = [];
  }
  /***************************************************************************** 页面展示值 *************************************/
  meterValueChange() {
    this.runlogReq.dailyEnergy =
      (this.runlogReq.meterValue - this.getYesterdayMeterValue) *
      this.runlogReq.meterRatio;
  }
  //昨日计量表示值（默认上一条数据）
  get getYesterdayMeterValue() {
    return (
      (this.yesterdayMsg &&
        this.yesterdayMsg["lastJobRecord"] &&
        this.yesterdayMsg["lastJobRecord"]["meterValue"]) ||
      0
    );
  }
  //今日上网电量(KWh)
  get getDailyEnergy() {
    return (
      (this.runlogReq.meterValue - this.getYesterdayMeterValue) *
      this.runlogReq.meterRatio
    );
  }
  //今日每MW上网电量(KWh)
  get getDailyEnergyMW() {
    return (
      (this.getDailyEnergy &&
        this.getDailyEnergy / this.runlogReq.parallelCapacity) ||
      0
    );
  }
  //本月上网电量(KWh)
  get getMouthEnergy() {
    return (
      parseFloat((this.yesterdayMsg && this.yesterdayMsg["monthEnergy"]) || 0) +
        this.getDailyEnergy || 0
    );
  }

  getWindDirection() {
    for (let dir of this.ders) {
      if (this.runlogReq.windDirection == dir["value"]) {
        return dir["name"];
      }
    }
    this.runlogReq.windDirection = this.ders[0]["value"];
    return (this.runlogReq.windDirection = this.ders[0]["name"]);
  }
  public updateGenHours() {
    this.runlogReq.genHours =
      0 +
      this.toNumber(this.runlogReq.genHoursFine) +
      this.toNumber(this.runlogReq.genHoursPcloud) +
      this.toNumber(this.runlogReq.genHoursCloudy) +
      this.toNumber(this.runlogReq.genHoursWet) +
      this.toNumber(this.runlogReq.genHoursRain);
  }
  private toNumber(x: number | string): number {
    if (typeof x === "number") {
      return x;
    } else {
      return parseFloat(x);
    }
  }

  /***************************************************************************** 结束 ****************************************************/

  //验证第一页数据是否正确
  firstVerification() {
    if (
      !this.runlogReq.meterRatio ||
      this.decimalNum(parseInt(this.runlogReq.meterRatio.toString())) != 0
    ) {
      return "电表倍率";
    }
    if (
      !this.runlogReq.parallelCapacity ||
      this.decimalNum(this.runlogReq.parallelCapacity) > 6
    ) {
      return "当前并网装机容量";
    }
    if (
      this.runlogReq.meterValue &&
      this.decimalNum(this.runlogReq.meterValue) > 2
    ) {
      return "今日计量表示值";
    }
    if (
      this.runlogReq.maxPower &&
      this.decimalNum(this.runlogReq.maxPower) == 9999
    ) {
      return "今日最大负荷";
    }
    return true;
  }

  //验证第二页数据是否正确
  secondVerification() {
    if (
      this.runlogReq.jobRecordLosses &&
      this.runlogReq.jobRecordLosses.length > 0
    ) {
      let now = new Date();
      let date =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      for (let jobRecordLoss of this.runlogReq.jobRecordLosses) {
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
      this.runlogReq.irradiation &&
      this.decimalNum(this.runlogReq.irradiation) > 2
    ) {
      return "日辐照量";
    }
    if (
      !this.runlogReq.weatherInfo ||
      this.runlogReq.weatherInfo.length > 100
    ) {
      return "今日天气";
    }
    if (this.runlogReq.maxTemp && this.decimalNum(this.runlogReq.maxTemp) > 2) {
      return "最高温度";
    }
    if (this.runlogReq.minTemp && this.decimalNum(this.runlogReq.minTemp) > 2) {
      return "最低温度";
    }
    if (
      this.runlogReq.windSpeed &&
      this.decimalNum(this.runlogReq.windSpeed) > 2
    ) {
      return "风速";
    }
    if (
      this.runlogReq.genHoursFine &&
      this.decimalNum(this.runlogReq.genHoursFine) > 2
    ) {
      return "晴天时长";
    }
    if (
      this.runlogReq.genHoursPcloud &&
      this.decimalNum(this.runlogReq.genHoursPcloud) > 2
    ) {
      return "少云时长";
    }
    if (
      this.runlogReq.genHoursCloudy &&
      this.decimalNum(this.runlogReq.genHoursCloudy) > 2
    ) {
      return "多云时长";
    }
    if (
      this.runlogReq.genHoursWet &&
      this.decimalNum(this.runlogReq.genHoursWet) > 2
    ) {
      return "阴霾时长";
    }
    if (
      this.runlogReq.genHoursRain &&
      this.decimalNum(this.runlogReq.genHoursRain) > 2
    ) {
      return "雨雪时长";
    }
    if (
      this.runlogReq.genHours &&
      this.decimalNum(this.runlogReq.genHours) > 2
    ) {
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
          this.runlogReq.windDirection = dir["value"];
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
    this.constantsService.weatherInfo(e => {
      this.runlogReq.weatherInfo = e.propValue;
      this.runlogReq.weatherInfoName = e.propName;
      console.log(e);
    });
  }

  /**
   * 损失类别选择
   */
  getLossTypes(index) {
    this.constantsService.lossType(e => {
      this.runlogReq.jobRecordLosses[index]["lossType"] = e.propValue;
      this.runlogReq.jobRecordLosses[index]["lossTypeText"] = e.propName;
    });
  }

  equipment(index, deviceName) {
    if (this.station && this.station.stationId) {
      this.navCtrl.push(DeviceModelPage, {
        stationId: this.station.stationId,
        index,
        deviceName
      });
    } else {
      this.mutilService.customAlert({ msg: "请先选择电站!" });
    }
  }

  deleteRecordLoss(index) {
    this.runlogReq.jobRecordLosses.splice(index, 1);
  }

  addRecordLoss() {
    this.runlogReq.jobRecordLosses.push({});
  }
}
