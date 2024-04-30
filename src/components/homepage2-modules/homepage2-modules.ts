import { InspectionsPage } from './../../pages/operations/inspections/inspections';
import { OperateTicketsPage } from './../../pages/operations/operate-tickets/operate-tickets';
import { RepairTicketPage } from './../../pages/operations/repair-ticket/repair-ticket';
import { DefectManagementPage } from './../../pages/operations/defect-management/defect-management';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ModulesDetails1Page } from '../../pages/home/modules-details/modules-details1/modules-details1';
import { ModulesService } from '../../providers/modules.service';
import { JobRecordPage } from '../../pages/operations/job-record/job-record';
import { InventorisPage } from '../../pages/operations/inventoris/inventoris';
import { DailyReport } from '../../pages/home/daily-report/daily-report';
import { ModulesDetails2Page } from '../../pages/home/modules-details/modules-details2/modules-details2';
import { ModulesDetails3Page } from '../../pages/home/modules-details/modules-details3/modules-details3';
import { ModulesDetails4Page } from '../../pages/home/modules-details/modules-details4/modules-details4';
import { MaintainsPage } from '../../pages/operations/maintains/maintains';
import { ReportProductionMonthlyLyPage } from '../../pages/home/report-production-monthly-ly/report-production-monthly-ly';
import { EnergyReportPage } from '../../pages/home/energy-report/energy-report';
import { InventorisRecordPage } from '../../pages/operations/inventoris/inventoris-record/inventoris-record';

/**
 * Generated class for the Homepage2ModulesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'homepage2-modules',
  templateUrl: 'homepage2-modules.html',
})
export class Homepage2ModulesComponent {
  modules;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,

    private modulesService: ModulesService
  ) {
    this.getmodules2();
  }

  /**拼接图片路径 */
  getImg(imgName) {
    return 'assets/imgs/module/' + imgName;
  }

  /**获取图标列表 */
  getmodules2() {
    this.modulesService.modules2().subscribe((e) => {
      console.log(e);
      if (e) {
        this.modules = e.map(item => {
          return {
            ...item,
            modules: item.modules.filter(module => {
              return module.show
            })
          }
        });
      }
    });
  }

  toSearchPage(m) {
    if (m.id === 'APP_MT_STATION_LIST') {
      let searchModal;
      if (m && m.param) {
        if (m.name === '运行效率') {
          // group

          // this.navCtrl.push(ModulesDetails2Page, {
          //     param: 'group'
          // });

          searchModal = this.modalCtrl.create(
            ModulesDetails2Page,
            { param: 'group' },
            { showBackdrop: true }
          );
        } else {
          // this.navCtrl.push(ModulesDetails1Page, {
          //     param: m.param
          // });
          searchModal = this.modalCtrl.create(
            ModulesDetails1Page,
            { param: m.param },
            { showBackdrop: true }
          );
        }
        searchModal.present();
      }
    } else {
      this.toPage(m);
    }
  }

  toPage(m) {
    let id = m.id;
    let searchModal;
    switch (id) {
      //集团日报
      case 'APP_ENERGY_RPT':
        this.navCtrl.push(DailyReport);
        break;
      // 运行日报
      case 'APP_JOB_RECORD':
        this.navCtrl.push(JobRecordPage);
        break;
      // 缺陷管理
      case 'APP_DEFECT':
        this.navCtrl.push(DefectManagementPage);
        break;
      // 物资库存
      case 'APP_MATERIAL':
        this.navCtrl.push(InventorisPage, {
          materialType: '',
        });
        break;
      // 物资记录
      case 'APP_IOSTORAGE':
        this.navCtrl.push(InventorisRecordPage, {
          materialType: '',
        });
        break;
      // 工作票
      case 'APP_OP_WORK_TICKET':
        // this.navCtrl.push(JobRecordPage);
        break;
      // 操作票
      case 'APP_OP_OPERATE_TICKET':
        this.navCtrl.push(OperateTicketsPage);
        break;
      // 抢修单
      case 'APP_OP_REPAIR':
        this.navCtrl.push(RepairTicketPage);
        break;
      // 检修预试
      case 'APP_OP_CHECK':
        this.navCtrl.push(MaintainsPage);
        break;
      // 电站生产月报
      case 'APP_RPT_PROD_M_LY':
        this.navCtrl.push(ReportProductionMonthlyLyPage, {
          param: id,
          title: m.name,
        });
        break;
      // 损失电量统计
      case 'APP_RPT_LOSS1':
        searchModal = this.modalCtrl.create(
          ModulesDetails3Page,
          { param: id, title: m.name },
          { showBackdrop: true }
        );
        searchModal.present();
        break;
      // 损失电量明细
      case 'APP_RPT_LOSS2':
        searchModal = this.modalCtrl.create(
          ModulesDetails4Page,
          { id: id, title: m.name },
          { showBackdrop: true }
        );
        searchModal.present();
        break;

      // 巡视检查
      case 'APP_INSPECTION':
        this.navCtrl.push(InspectionsPage);
        break;
      // 发电量报表
      case 'APP_RPT_ENERGY':
        searchModal = this.modalCtrl.create(EnergyReportPage, {
          showBackdrop: true,
        });
        searchModal.present();
        break;
      default:
        break;
    }
  }
}
