import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppUpdate } from '@ionic-native/app-update';
import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { Media } from '@ionic-native/media';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { QRScanner } from '@ionic-native/qr-scanner';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {
  Config,
  IonicApp,
  IonicErrorHandler,
  IonicModule
} from 'ionic-angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { VgBufferingModule } from 'videogular2/buffering';
import { VgControlsModule } from 'videogular2/controls';
import { VgCoreModule } from 'videogular2/core';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgStreamingModule } from 'videogular2/streaming';
import { ComponentsModule } from '../components/components.module';
import { APP_CONFIG } from '../models/app-config';
import { BarcodeScannerPage } from '../pages/barcode-scanner/barcode-scanner';
import { AllCompany } from '../pages/common/allCompany/all-company';
import { AllCompanys } from '../pages/common/allCompany/all-companys';
import { DeviceModel } from '../pages/common/deviceModel/device-model';
import { DeviceArchivePage } from '../pages/device-archive/device-archive';
import { DeviceDocPage } from '../pages/device-doc/device-doc';
import { DeviceTopoPage } from '../pages/device-topo/device-topo';
import { DailyReport } from '../pages/home/daily-report/daily-report';
import { ReportDetail } from '../pages/home/daily-report/report-detail/report-detail';
import { EnergyReportPage } from '../pages/home/energy-report/energy-report';
import { EquipmentMessage } from '../pages/home/equipment-message/equipment.message';
import { HomePage } from '../pages/home/home';
import { LogList } from '../pages/home/log-list/log.list';
import { DeviceDetailsPage } from '../pages/home/modules-details/modules-details1/device-details/device-details';
import { ModulesDetails1Page } from '../pages/home/modules-details/modules-details1/modules-details1';
import { ModulesDetails2Page } from '../pages/home/modules-details/modules-details2/modules-details2';
import { ModulesDetails3Page } from '../pages/home/modules-details/modules-details3/modules-details3';
import { ModulesDetails4Page } from '../pages/home/modules-details/modules-details4/modules-details4';
import { ModulesNewPage } from '../pages/home/modules-details/modules-new';
import { NewLog_old } from '../pages/home/new-log/new-log';
import { NewLog } from '../pages/home/new-log/new.log';
import { ReportProductionMonthlyLyPage } from '../pages/home/report-production-monthly-ly/report-production-monthly-ly';
import { EditLog } from '../pages/home/run-log/edit-log/edit-log';
import { RunLog } from '../pages/home/run-log/run-log';
import { ScanMessage } from '../pages/home/scan-message/scan.message';
import { WarnDetails } from '../pages/home/warn-details/warn.details';
import { WarnMessage } from '../pages/home/warn-message/warn.message';
import { LoginPage } from '../pages/login/login';
import { CheckWarehouse } from '../pages/modal/check-warehouse/check-warehouse';
import { SearchWarehouse } from '../pages/modal/search-warehouse/search-warehouse';
import { CameraHlsPage } from '../pages/monitor/camera-hls/camera-hls';
import { CameraListPage } from '../pages/monitor/camera-list/camera-list';
import { EquipmentListPage } from '../pages/monitor/equipment/equipmentList';
import { MonitorPage } from '../pages/monitor/monitor';
import { PowStaRecords } from '../pages/monitor/power-station-records/pow.sta.records';
import { MyPage } from '../pages/my/my';
import { PasswordPage } from '../pages/my/password/password';
import { CargoIn } from '../pages/operations/cargo-manage/cargo-in/cargo-in';
import { CargoManage } from '../pages/operations/cargo-manage/cargo-manage';
import { CargoOut } from '../pages/operations/cargo-manage/cargo-out/cargo-out';
import { DefectManagementDetailsPage } from '../pages/operations/defect-management-details/defect-management-details';
import { DefectManagementPage } from '../pages/operations/defect-management/defect-management';
import { InspectionDevicePage } from '../pages/operations/inspections-details/inspection-device/inspection-device';
import { InspectionItemHisPage } from '../pages/operations/inspections-details/inspection-item-his/inspection-item-his';
import { InspectionsDetailsPage } from '../pages/operations/inspections-details/inspections-details';
import { InspectionsMoreMenuPage } from '../pages/operations/inspections-details/more-menu/more-menu';
import { InspectionsPage } from '../pages/operations/inspections/inspections';
import { InspectionsMenusPage } from '../pages/operations/inspections/inspections-menus/inspections-menus';
import { InventorisPage } from '../pages/operations/inventoris/inventoris';
import { InventorisMenusPage } from '../pages/operations/inventoris/inventoris-menus/inventoris-menus';
import { InventorisOutInPage } from '../pages/operations/inventoris/inventoris-out-in/inventoris-out-in';
import { InventorisRecordPage } from '../pages/operations/inventoris/inventoris-record/inventoris-record';
import { JobRecordDetailsPage } from '../pages/operations/job-record-details/job-record-details';
import { JobRecordPage } from '../pages/operations/job-record/job-record';
import { MaintainsDetailsPage } from '../pages/operations/maintains-details/maintains-details';
import { MaintainsDevicePage } from '../pages/operations/maintains-details/maintains-device/maintains-device';
import { MaintainsItemHisPage } from '../pages/operations/maintains-details/maintains-item-his/maintains-item-his';
import { MaintainsMoreMenuPage } from '../pages/operations/maintains-details/more-menu/more-menu';
import { MaintainsPage } from '../pages/operations/maintains/maintains';
import { MaintainsMenusPage } from '../pages/operations/maintains/maintains-menus/maintains-menus';
import { NoticeDetails } from '../pages/operations/notice-details/notice.details';
import { NoticeList } from '../pages/operations/notice-list/notice.list';
import { OperateTask } from '../pages/operations/operate-task/operate-task';
import { OperateTicketsDetailsPage } from '../pages/operations/operate-tickets-details/operate-tickets-details';
import { OperateTicketsPage } from '../pages/operations/operate-tickets/operate-tickets';
import { Operations } from '../pages/operations/operations';
import { OrderPage } from '../pages/operations/orderPage/order.page';
import { RepairTicketDetailsPage } from '../pages/operations/repair-ticket-details/repair-ticket-details';
import { RepairTicketPage } from '../pages/operations/repair-ticket/repair-ticket';
import { ToolBorrow } from '../pages/operations/tool-page/tool-borrow/tool-borrow';
import { ToolPage } from '../pages/operations/tool-page/tool-page';
import { ToolReturn } from '../pages/operations/tool-page/tool-return/tool-return';
import { ToolPageV1 } from '../pages/operations/tool-v1/tool';
import { ToolonePage } from '../pages/operations/tool-v1/tool-content-one';
import { TooltwoPage } from '../pages/operations/tool-v1/tool-content-two';
import { WorkTicket1Page } from '../pages/operations/work-ticket1/work-ticket1';
import { WorkTicket2Page } from '../pages/operations/work-ticket2/work-ticket2';
import { QrResultBarPage } from '../pages/qr-result-bar/qr-result-bar';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';
import { CommonDefectObjectsPage } from '../pages/util/common-defect-objects/common-defect-objects';
import { EquipmentListPage as commonEquipmentListPage } from '../pages/util/common-equipment/equipmentList';
import { SelectedEquipmentListPage } from '../pages/util/common-equipment/selected-equipment-list/selected-equipment-list';
import { CommonIotypesPage } from '../pages/util/common-iotypes/common-iotypes';
import { CommonMaterialsPage } from '../pages/util/common-materials/common-materials';
import { CommonStationPage } from '../pages/util/common-station/common-station';
import { CommonTeamsPage } from '../pages/util/common-teams/common-teams';
import { CommonTypicalOperateTicketsPage } from '../pages/util/common-typical-operate-tickets/common-typical-operate-tickets';
import { CommonUserPage } from '../pages/util/common-user/common-user';
import { SelectedUserListPage } from '../pages/util/common-user/selected-user-list/selected-user-list';
import { GlobalSearch } from '../pages/util/global-search/global.search';
import { CommonCheckMemosPage } from '../pages/util/modal/common-check-memos/common-check-memos';
import { CommonCheckPage } from '../pages/util/modal/common-check/common-check';
import { CommonDefectCodePage } from '../pages/util/modal/common-defect-code/common-defect-code';
import { CommonDispatchPage } from '../pages/util/modal/common-dispatch/common-dispatch';
import { CommonInputPage } from '../pages/util/modal/common-input/common-input';
import { CommonOperateStepPage } from '../pages/util/modal/common-operate-step/common-operate-step';
import { CommonRadioTextareaPage } from '../pages/util/modal/common-radio-textarea/common-radio-textarea';
import { CommonTextareaPage } from '../pages/util/modal/common-textarea/common-textarea';
import { DefectDevicesPage } from '../pages/util/modal/defect-devices/defect-devices';
import { DefectObjectsPage } from '../pages/util/modal/defect-objects/defect-objects';
import { InventorisRecordSearchPage } from '../pages/util/modal/inventoris-record-search/inventoris-record-search';
import { JobRecordLossesPage } from '../pages/util/modal/job-record-losses/job-record-losses';
import { JobRecordSearchPage } from '../pages/util/modal/job-record-search/job-record-search';
import { OperateTicketsSearchPage } from '../pages/util/modal/operate-tickets-search/operate-tickets-search';
import { WarnSearchPage } from '../pages/util/modal/warn-search/warn-search';
import { KeysPipe } from '../pipes/keys.pipe';
import { alarmlogsService } from '../providers/alarmlogs.service';
import { AuthHttpService } from '../providers/auth-http.service';
import { BackendService } from '../providers/backend.service';
import { CommentProvider } from '../providers/comment/comment';
import { httpInterceptorProviders } from '../providers/core/http-interceptors';
import { DailyReportService } from '../providers/dailyreport.service';
import { DefesService } from '../providers/defes.servicer';
import { EchartsService } from '../providers/echarts.service';
import { EquipmentService } from '../providers/equipment.service';
import { HomeService } from '../providers/home.service';
import { InspectionsProvider } from '../providers/inspections.service';
import { NativeService } from '../providers/location-plugin';
import { MaintainsProvider } from '../providers/maintains.service';
import { MaterialService } from '../providers/material.service';
import { ModulesService } from '../providers/modules.service';
import { MonitorService } from '../providers/monitor.service';
import { OperateTicketsProvider } from '../providers/operate-tickets.service';
import { OperationsService } from '../providers/operations.service';
import { QrSearchService } from '../providers/qr-search.service';
import { RepairTicketsProvider } from '../providers/repair-tickets.service';
import { RunLogService } from '../providers/runlog.service';
import { UserService } from '../providers/user.servicer';
import { CacheService } from '../providers/util/cache.service';
import { ConstantsService } from '../providers/util/constants.service';
import { MutilService } from '../providers/util/Mutil.service';
import { PluginService } from '../providers/util/plugin.service';
import { VideoService } from '../providers/video.service';
import { ComponentsUtil } from '../util/components.util';
import { DEV_CONFIG, RELEASE_CONFIG } from './../models/app-config';
import { CommonWarehousePage } from './../pages/util/common-warehouse/common-warehouse';
import { SettingsProvider } from './../providers/settings/settings';
import { DebounceService } from './../providers/debounce.service';
import { MyApp } from './app.component';
import {
  ModalFromRightEnter,
  ModalFromRightLeave,
  ModalScaleEnter,
  ModalScaleLeave
} from './modal-transitions';
import { SettingPage } from '../pages/monitor/child/setting';

const modals = [
  CommonInputPage,
  JobRecordLossesPage,
  commonEquipmentListPage,
  SelectedEquipmentListPage,
  CommonUserPage,
  SelectedUserListPage,
  CommonTextareaPage,
  JobRecordSearchPage,
  CommonMaterialsPage,
  CommonWarehousePage,
  CommonDefectObjectsPage,
  DefectObjectsPage,
  CommonCheckPage,
  CommonDispatchPage,
  CommonDefectCodePage,
  WarnSearchPage,
  CommonCheckMemosPage,
  CommonTeamsPage,
  OperateTicketsSearchPage,
  CommonOperateStepPage,
  CommonTypicalOperateTicketsPage,
  CommonRadioTextareaPage,
  DefectDevicesPage,
  CommonIotypesPage,
  InventorisRecordSearchPage,
];

const homeTabPage = [ReportProductionMonthlyLyPage, EnergyReportPage];

const operateTabPage = [
  DefectManagementPage,
  DefectManagementDetailsPage,
  RepairTicketPage,
  WorkTicket1Page,
  WorkTicket2Page,
  CameraHlsPage,
  RepairTicketDetailsPage,
  OperateTicketsPage,
  OperateTicketsDetailsPage,
  InspectionsPage,
  InspectionsMenusPage,
  InspectionsDetailsPage,
  InspectionDevicePage,
  InspectionItemHisPage,
  MaintainsItemHisPage,
  InspectionsMoreMenuPage,
  MaintainsPage,
  MaintainsMenusPage,
  MaintainsDetailsPage,
  MaintainsDevicePage,
  MaintainsMoreMenuPage,
  OrderPage,
];

@NgModule({
  declarations: [
    MyApp,
    MonitorPage,
    HomePage,
    TabsPage,
    Operations,
    JobRecordPage,
    JobRecordDetailsPage,
    InventorisPage,
    InventorisMenusPage,
    InventorisOutInPage,
    InventorisRecordPage,
    NewLog,
    ScanMessage,
    BarcodeScannerPage,
    QrResultBarPage,
    WarnMessage,
    WarnDetails,
    MyPage,
    PasswordPage,
    EquipmentMessage,
    NoticeList,
    NoticeDetails,
    PowStaRecords,
    CargoManage,
    CheckWarehouse,
    SearchWarehouse,
    CargoOut,
    ToolPage,
    GlobalSearch,
    CargoIn,
    ToolReturn,
    ToolBorrow,
    OperateTask,
    LogList,
    LoginPage,
    RegisterPage,
    KeysPipe,
    SettingPage,
    DeviceArchivePage,
    DeviceTopoPage,
    DeviceDocPage,
    /**临时 */
    DailyReport,
    ReportDetail,
    RunLog,
    EditLog,
    NewLog_old,
    AllCompany,
    EquipmentListPage,
    ToolPageV1,
    ToolonePage,
    TooltwoPage,
    CameraListPage,
    AllCompanys,
    DeviceModel,
    CommonStationPage,
    ModulesDetails1Page,
    ModulesDetails2Page,
    ModulesNewPage,
    DeviceDetailsPage,
    ModulesDetails3Page,
    ModulesDetails4Page,
    ...homeTabPage,
    ...operateTabPage,
    ...modals,
  ],
  imports: [
    BrowserModule,
    NgxEchartsModule,
    HttpClientModule,
    ComponentsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,

    IonicModule.forRoot(MyApp, {
      backButtonText: ' ',
      iconMode: 'ios',
      mode: 'ios',
      tabsHideOnSubPages: true,
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MonitorPage,
    HomePage,
    TabsPage,
    Operations,
    JobRecordPage,
    JobRecordDetailsPage,
    InventorisPage,
    InventorisMenusPage,
    InventorisOutInPage,
    InventorisRecordPage,
    NewLog,
    ScanMessage,
    BarcodeScannerPage,
    QrResultBarPage,
    WarnMessage,
    WarnDetails,
    MyPage,
    PasswordPage,
    EquipmentMessage,
    NoticeList,
    NoticeDetails,
    PowStaRecords,
    CargoManage,
    CheckWarehouse,
    SearchWarehouse,
    CargoOut,
    ToolPage,
    GlobalSearch,
    CargoIn,
    ToolReturn,
    ToolBorrow,
    OperateTask,
    LogList,
    LoginPage,
    RegisterPage,
    SettingPage,
    DeviceArchivePage,
    DeviceTopoPage,
    DeviceDocPage,
    /**临时 */
    DailyReport,
    ReportDetail,
    RunLog,
    EditLog,
    NewLog_old,
    AllCompany,
    EquipmentListPage,
    ToolPageV1,
    ToolonePage,
    TooltwoPage,
    CameraListPage,
    AllCompanys,
    DeviceModel,
    CommonStationPage,
    ModulesDetails1Page,
    ModulesDetails2Page,
    ModulesNewPage,
    DeviceDetailsPage,
    ModulesDetails3Page,
    ModulesDetails4Page,
    ...homeTabPage,
    ...operateTabPage,
    ...modals,
  ],
  providers: [
    AppUpdate,
    Camera,
    FileTransfer,
    File,
    FilePath,
    ImagePicker,
    PhotoViewer,
    FileChooser,
    IOSFilePicker,
    AppVersion,
    StatusBar,
    SplashScreen,
    EchartsService,
    ComponentsUtil,
    AuthHttpService,
    MutilService,
    ConstantsService,
    HomeService,
    MonitorService,
    alarmlogsService,
    QrSearchService,
    UserService,
    ModulesService,
    OperationsService,
    /**临时 */
    DailyReportService,
    EquipmentService,
    DefesService,
    PluginService,
    RunLogService,
    BackendService,
    CacheService,
    MaterialService,
    VideoService,
    AndroidPermissions,
    QRScanner,
    ScreenOrientation,
    CommentProvider,
    RepairTicketsProvider,
    OperateTicketsProvider,
    InspectionsProvider,
    Geolocation,
    Media,
    NativeService,
    MaintainsProvider,
    httpInterceptorProviders,
    SettingsProvider,
    DebounceService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: APP_CONFIG, useValue: DEV_CONFIG },
  ],
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }
}
