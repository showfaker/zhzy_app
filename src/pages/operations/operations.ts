import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { HomeService } from '../../providers/home.service';
import { MutilService } from '../../providers/util/Mutil.service';
import { OperationsService } from '../../providers/operations.service';
import echarts from 'echarts';
import { EchartsService } from '../../providers/echarts.service';
import { OrderPage } from './orderPage/order.page';
import { DefectManagementPage } from './defect-management/defect-management';
import { OperateTicketsPage } from './operate-tickets/operate-tickets';
import { RepairTicketPage } from './repair-ticket/repair-ticket';
import { MaintainsPage } from './maintains/maintains';
import { InspectionsPage } from './inspections/inspections';
import * as moment from 'moment';
@Component({
  selector: 'operations',
  templateUrl: 'operations.html',
})

/**
 * 运维
 */

export class Operations {
  // toDate = this.mUtil.buildTime('yyyy-MM', new Date().getTime());
  toDate = moment().format('YYYY-MM');
  // startDate = this.mUtil.buildTime('yyyy-MM', new Date().getTime()); //选择的时间
  startDate = moment().format('YYYY-MM');
  calendarDateList = [
    { v: '日' },
    { v: '一' },
    { v: '二' },
    { v: '三' },
    { v: '四' },
    { v: '五' },
    { v: '六' },
  ]; // 周
  calendarList = []; // 日
  ordersTypeList = [];
  orderDayList = [];
  @ViewChild('echarts') echarts: ElementRef;
  executed = 0; //总的已办数量
  unexecuted = 0; //总的待办数量

  dataType = '0';

  constructor(
    public navCtrl: NavController,
    public homeService: HomeService,
    public mUtil: MutilService,
    public operationsService: OperationsService,
    public echartsService: EchartsService,
    public modalCtrl: ModalController
  ) { }

  ionViewWillEnter() {
    this.getOrders();
  }

  myChart;
  getOrders() {
    this.operationsService
      .ordersType(
      // .orderDay(
        this.dataType,
        moment(this.startDate).startOf('month').format('YYYY-MM-DD'),
        moment(this.startDate).endOf('month').format('YYYY-MM-DD')
      )
      .subscribe((e) => {
        console.log('ordersType:', e);
        this.ordersTypeList = [];
        this.unexecuted = 0;
        this.executed = 0;
        if (e) {
          this.ordersTypeList = e;
          for (var i in e) {
            if (e[i].executed != null) this.executed += e[i].executed;

            // 总计 - 待办数量
            // if (e[i].executed != null) {
            //   let executed = e[i].total - e[i].unexecuted;
            //   console.log("executed nums: ", executed);
              
            //   this.executed += executed;
            // }
            if (e[i].unexecuted != null) this.unexecuted += e[i].unexecuted;
          }
          let rate =
            this.executed + this.unexecuted == 0
              ? 'N/A'
              : ((this.executed * 100.0) / (this.executed + this.unexecuted)).toFixed(
                1
              );
          let datas = [
            { name: 'executed', value: this.executed },
            { name: 'unexecuted', value: this.unexecuted },
          ];
          let c = this.echarts.nativeElement;
          if (this.myChart) {
            // 原图表实例还在，销毁实例以免出现出现多个点击事件问题
            this.myChart.clear();
            this.myChart.dispose();
          }
          this.myChart = echarts.init(c, 'light');
          let option = this.echartsService.bulidOrdersTypeEchartOption(datas, rate);
          this.myChart.setOption(option);
        }
      });
    this.operationsService
      .orderDay(
        this.dataType,
        moment(this.startDate).startOf('month').format('YYYY-MM-DD'),
        moment(this.startDate).endOf('month').format('YYYY-MM-DD')
      )
      .subscribe((e) => {
        console.log('orderDay:', e);
        this.orderDayList = [];
        if (e) {
          this.orderDayList = e;
          this.buildCalendarList(this.startDate, e);
        }

        // this.ordersTypeList = [];
        // this.unexecuted = 0;
        // this.executed = 0;
        // if (e) {
        //   for (var i in e) {
        //     // 总计 - 待办数量
        //     if (e[i].total != null) {
        //       let executed = e[i].total - e[i].unexecuted;
        //       e[i].executed = executed;
        //       console.log("executed nums: ", executed);
              
        //       this.executed += executed;
        //     }
        //     if (e[i].unexecuted != null) this.unexecuted += e[i].unexecuted;
        //   }
        //   this.ordersTypeList = e;
        //   console.log("ordersTypeList: ", this.ordersTypeList);
          
        //   let rate =
        //     this.executed + this.unexecuted == 0
        //       ? 'N/A'
        //       : ((this.executed * 100.0) / (this.executed + this.unexecuted)).toFixed(
        //         1
        //       );
        //   let datas = [
        //     { name: 'executed', value: this.executed },
        //     { name: 'unexecuted', value: this.unexecuted },
        //   ];
        //   let c = this.echarts.nativeElement;
        //   if (this.myChart) {
        //     // 原图表实例还在，销毁实例以免出现出现多个点击事件问题
        //     this.myChart.clear();
        //     this.myChart.dispose();
        //   }
        //   this.myChart = echarts.init(c, 'light');
        //   let option = this.echartsService.bulidOrdersTypeEchartOption(datas, rate);
        //   this.myChart.setOption(option);
        // }
      });
    // this.operationsService.workbenchOrders('1','0','2020-04-01','2020-04-30').subscribe(e=>{
    //     console.log('workbenchOrders:',e)
    // })
  }

  geOrderDayValue(v) { }

  /**
   * 根据年月份 创建当月信息
   * @param year
   * @param month
   */
  buildCalendarList(date, dayVArr) {
    let that = this;
    this.calendarList = [];
    if (date) {
      let year = date.split('-')[0],
        month = date.split('-')[1];
      let numD = new Date(year, month, 0).getDate(); //当月有几天
      let m = '00' + date.split('-')[1];
      m = m.substr(m.length - 2, 2);
      let week = new Date(`${date.split('-')[0]}-${m}-01`).getDay(); //判断是星期几
      for (let index = 0; index < week; index++) {
        this.calendarList.push({ v: '' });
      }
      for (let index = 0; index < numD; index++) {
        /**添加日历上数据 */
        let i = dayVArr.findIndex((e) => {
          let d = new Date(e.startTime).getDate();
          return index + 1 === d;
        });
        let param = { v: index + 1 };
        if (i >= 0) {
          param['total'] = dayVArr[i].total;
          param['style'] = dayVArr[i].style;
        }

        this.calendarList.push(param);
      }
    } else {
    }
  }

  /**工单列表 */
  toOrderDay(param, singleDay?) {
    if (singleDay) {
      if (param.total) {
        let searchModal = this.modalCtrl.create(OrderPage, {
          singleDay: singleDay,
          status: '',
          dataType: this.dataType,
          startDate: moment(this.startDate).date(param.v).format('YYYY-MM-DD'),
        });
        searchModal.present();
      }
    } else {
      let searchModal = this.modalCtrl.create(OrderPage, {
        singleDay: singleDay,
        status: param,
        dataType: this.dataType,
        startDate: this.startDate,
      });
      searchModal.present();
      // this.navCtrl.push(OrderPage, {
      //     singleDay: singleDay,
      //     status: param,
      //     dataType: this.dataType,
      //     startDate: this.startDate })
    }
  }
  /**我的 全部切换 */
  changeDataType(type) {
    this.dataType = type;
    this.getOrders();
  }

  /**时间选择 */
  changeDate() {
    console.log(this.startDate);
    this.getOrders();
  }

  toPage(orderType, queryFlag?) {
    let param = { startDate: this.startDate };
    if (this.dataType === '0') {
      param['queryFlag'] = queryFlag;
    }
    switch (orderType.orderType) {
      // 缺陷管理
      case '01':
        this.navCtrl.push(DefectManagementPage, param);
        break;
      // 操作票
      case '07':
        this.navCtrl.push(OperateTicketsPage, param);
        break;
      // 抢修单
      case '08':
        this.navCtrl.push(RepairTicketPage, param);
        break;
      // 检修预试
      case '04':
        this.navCtrl.push(MaintainsPage, param);
        break;
      // 巡视检查
      case '02':
        this.navCtrl.push(InspectionsPage, param);
        break;
      default:
        break;
    }
  }
}
