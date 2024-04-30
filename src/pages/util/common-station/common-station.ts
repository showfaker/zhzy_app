import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MonitorService } from '../../../providers/monitor.service';
import { CacheService } from '../../../providers/util/cache.service';

/**
 * Generated class for the CommonStationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-common-station',
    templateUrl: 'common-station.html'
})
export class CommonStationPage {
    stationTypes = [];
    provinces = [];
    stationList = [];
    param = {
        provinceId: '',
        stationTypeId: '',
        myInput: ''
    };
    pageIndex: number = 0;
    isMultiSelect:boolean = false;//是否多选 false
    selectedStationList = [];
    constructor(
        public navParams : NavParams,
        private viewCtrl: ViewController,
        public monitorService: MonitorService,
        public cacheService: CacheService,
        private navCtrl: NavController
    ) {
        this.isMultiSelect = this.navParams.get('isMultiSelect')  || false;
        if (this.isMultiSelect) {
            this.selectedStationList = JSON.parse(JSON.stringify(this.navParams.get('stationList') || []));//json转换避免直接返回是数据出现变化
        }
    }

    /**电站区域查询条件 */
    getprovinces() {
        this.monitorService.getprovinces().subscribe((e) => {
            if (e) {
                this.provinces = e;
                console.log(e);
            }
        });
    }
    /**电站类型查询条件 */
    getstationTypes() {
        this.monitorService.getstationTypes().subscribe((e) => {
            if (e) {
                this.stationTypes = e;
                console.log(e);
            }
        });
    }

    timeout; //筛选标识
    /**电站列表查询 */
    getstationlist(refresher?) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.monitorService
                .getstationlist(
                    this.param.myInput,
                    this.param.provinceId,
                    this.param.stationTypeId,
                    this.pageIndex
                )
                .subscribe((e) => {
                    if (e) {
                        this.stationList = this.stationList.concat(e['content']);
                        // e['content'].forEach(station => {
                        //     this.stationIds.
                        // });
                        if (!e['content'].length || e['content'].length < 0) {
                            this.noDoInfinite = true;
                        } else {
                            this.noDoInfinite = false;
                        }
                    }
                    if (refresher) refresher.complete();
                });
        }, 1000 * 1.5);
    }

    ionViewWillEnter() {
        this.pageIndex = 0;
        this.param = this.cacheService.getStationSelect();
        this.getstationlist();
        this.getprovinces();
        this.getstationTypes();
    }

    ionViewWillLeave() {
        this.cacheService.setStationSelect(this.param);
    }

    /********************************筛选条件*************************************************************************/
    /**显示/隐藏赛选页 */
    switch = true;

    getValue(value, number) {
        let arr = value.split(':');
        if (number == 0) return arr[number];
        if (number == 1 && arr.length == 2) return arr[number];
        else return '无';
    }
    select(type, id) {
        if (id === this.param[type]) {
            this.param[type] = '';
        } else {
            this.param[type] = id;
        }
        this.stationList = [];
        this.pageIndex = 0;
        this.getstationlist();
    }
    onCancel() {
        this.stationList = [];
        this.pageIndex = 0;
        this.getstationlist();
    }
    /********************************筛选条件*************************************************************************/

    noDoInfinite = false;
    doInfinite(refresher) {
        this.pageIndex++;
        this.getstationlist(refresher);
    }

    close(station?) {
        if (station) {
            if (this.isMultiSelect) {
                let index = this.selectedStationList.findIndex(e=>{
                    return e.id === station.id
                })
                if (index>=0) {
                    this.selectedStationList.splice(index,1)
                }else {
                    this.selectedStationList.push(station)
                }
                
                // station['selected'] = !station['selected']     
            }else {
                this.viewCtrl.dismiss(station);
            }
        } else {
            this.viewCtrl.dismiss();
        }
    }

    /********************************多选*************************************************************************/
    isshowelectedList = false;
    showElectedList(){
        this.isshowelectedList =  !this.isshowelectedList;
    }
    getSelectStationNum(){
        
        return this.selectedStationList.length;
    }

    isSelect(station){
        let index = this.selectedStationList.findIndex(e=>{
            return e.id === station.id
        })
        return index>=0
    }

    delate(i){
        this.selectedStationList.splice(i,1)
    }

    submit(){
      
        this.viewCtrl.dismiss(this.selectedStationList);
    }


}
