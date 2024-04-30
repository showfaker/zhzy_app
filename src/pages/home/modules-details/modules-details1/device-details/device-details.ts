import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, ModalController, Events, NavParams, ViewController, MenuController, ActionSheetController } from 'ionic-angular';
import { ModulesService } from '../../../../../providers/modules.service';
import { MutilService } from '../../../../../providers/util/Mutil.service';
import { CommonStationPage } from '../../../../util/common-station/common-station';
import { EquipmentMessage } from '../../../equipment-message/equipment.message';


@Component({
    selector: 'page-device-details',
    templateUrl: 'device-details.html'
})
export class DeviceDetailsPage {

    param = {
        data:'',
        stationId:'',
        deviceType:''
    };//参数
    modulesDetails;
    station = {};
    toDate = this.mUtil.buildTime('yyyy-MM-dd',new Date().getTime());
    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public event: Events,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public modulesService: ModulesService,
        public menuController: MenuController,
        public mUtil: MutilService,
        public actionSheetCtrl: ActionSheetController
    ) {
        this.param = this.navParams.get('param')
    }

    ionViewDidLoad() {
        this.initDetails(this.param)
    }

    /**
     * 初始化详情页面
     * @param param 参数 根据不同模块获取不同参数
     */
    initDetails(param: any) {
        let that = this
        this.modulesService.deviceListInit(param.data,param.deviceType,param.stationId).subscribe(e => {
            console.log('设备状态列表初始化：', e)
            if (e) {
                that.station['id'] = param.stationId
                that.station['title'] = e.title
                that.modulesDetails = e;
                // if (e.dateType == '1' || e.dateType == '2') {
                //     that.startDate = that.mUtil.buildTime('yyyy-MM-dd', e.startDate);
                // }
                // if (e.dateType == '2') {
                //     that.endDate = that.mUtil.buildTime('yyyy-MM-dd', e.endDate);
                // }
                that.getModulesList()

            }
        })
    }

    modulesList = [];
    /**
     * 获取列表信息
     * @param param 
     */
    getModulesList(refresher?) {
        this.modulesService.deviceList(this.param.data, this.buildData()).subscribe(e => {
            console.log('数据列表:', this.param, " ", e)
            if (e && e["content"] && e["content"].length > 0) {
                this.modulesList = this.modulesList.concat(e["content"]);
                // this.modulesList = e.content; 
            }
            if (this.modulesList.length >= e.totalElements) {
                this.canInfinite = false;
            }else {
                this.canInfinite = true;
            }
            if (refresher) {
                refresher.complete();
                console.log('加载完成后，关闭刷新'); 
            }
        })
    }

    buildData() {
        // stationId：电站ID，必填，单选
        // status：状态列表，非必填
        // deviceTypes：设备分类列表，非必填
        // deviceName：设备编号或名称，非必填

        // sort：排序字段code，必填
        // direction：排序方向，asc或desc，必填
        // page：当前页（从0开始），默认0 
        // size：每页记录数，默认10

        let build = function(data){
            let param = ''
            for (let obj of data) {
                if (obj && obj.selected) {
                    if(param) param = param  + ',' + obj.id 
                    else param =  obj.id ;
                }
                
            }
            return param
        }
        let data = {}
   
        data['stationId'] = this.param.stationId;
        data['status'] = build(this.modulesDetails.status);
        data['deviceTypes'] = build(this.modulesDetails.deviceTypes);;
        data['deviceName'] = this.modulesDetails.deviceName;

        data['sort'] = this.modulesDetails.defaultSort.first;
        data['direction'] = this.modulesDetails.direction || 'asc';
        data['page'] = this.page || 0;
        data['size'] = 10;

        return data

    }
    

    goBack() {
        this.viewCtrl.dismiss()
    }

    backupsModulesDetails;//打开侧边栏时备份筛选条件
    /**搜索菜单打开时 */
    menuInit() {
        this.backupsModulesDetails =  JSON.parse(JSON.stringify(this.modulesDetails))
    }

    /**搜索菜单关闭时 */
    ionClose() {

    }

    /**控制侧边栏 */
    serchMenu() {
        this.menuController.enable(true, 'deivcesearch');
        this.menuController.open('deivcesearch')
    }

    /**拼接图片路径 */
    getImg(imgName) {
        return   this.modulesService.getImg(imgName)
    }

    /**
     * 生成选项列表
     * @param datas 列表
     * @param name1 列表显示内容的key
     * @param name2 点击需要的key值 若为空则取整个对象
     * @param key 保存在modulesDetails中的key值
     * @param isQ 是否查询初始化查询列表
     */
    buildActionSheet(datas, name1, name2, key, isQ) {
        let that = this
        let buttons = []
        for (const data of datas) {
            buttons.push({
                text: data[name1],
                handler: () => {
                    if (name2) {
                        that.modulesDetails[key] = data[name2]
                    } else {
                        that.modulesDetails[key] = data
                    }
                    if (isQ) {
                        that.submit()
                    }
                }
            })
        }
        buttons.push({
            text: '取消',
            role: 'cancel',
            handler: () => {
                console.log('取消 clicked');
            }
        })
        let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'modules-details1-sheetctrl',
            buttons: buttons
        })
        actionSheet.present();
        console.log('Clicked to update picture');
    }

    /**选择 */
    select(key,obj) {
        switch (key) {
            case 'defaultSort':
                this.buildActionSheet(this.modulesDetails.sorts, 'second', '', key, true);
                break;
            case 'desc':
                this.modulesDetails.direction = key;
                this.submit()
                break;
            case 'asc':
                this.modulesDetails.direction = key;
                this.submit()
                break;
            case 'status':
                if(obj) obj.selected = !obj.selected;
                break;
            case 'deviceTypes':
                if(obj) obj.selected = !obj.selected;
                break;
            

        }
    }



    /**重置 */
    reset(){
        this.modulesDetails = JSON.parse(JSON.stringify(this.backupsModulesDetails))
       
    }

    /**查询 */
    submit(){
        this.menuController.close('deivcesearch')
        this.page = 0;
        this.modulesList = [];
        if (this.station['id'] !== this.param.stationId) {
            this.param.stationId = this.station['id'];
            this.param.stationId = this.station['id'];
            this.modulesDetails.title = this.station['title'];
        }
        this.getModulesList();
        
    }

    page = 0;
    canInfinite = false;
    /**
     * 下拉刷新
     * 
     */
    doRefresh(refresher){
        console.log("下拉刷新");
        this.page = 0;
        this.modulesList = [];
        this.getModulesList(refresher);
    }

    /**
     * 上拉加载
     * @param infiniteScroll 
     */
    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        this.page ++ 
        this.getModulesList(infiniteScroll);
       
    }

// 电站选择
    selectStation() {
        let modal = this.modalCtrl.create(CommonStationPage, {});
        modal.onDidDismiss((e) => {
            if (e) {
                // this.modulesDetails['stationName'] = e.title
                // this.param.stationId =  e.id
                this.station = e;
            }
        });
        modal.present({ keyboardClose: true });
    }

    /**
     * 进入设备监测页面
     * @param equipment 
     */
    checkClick(modules) {
        if(modules && modules.url && modules.url =='APP_DEVICE_MONITOR')
        this.navCtrl.push(EquipmentMessage, {deviceId:modules.id});
    }


}
