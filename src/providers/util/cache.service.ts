import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
    //电站筛选条件缓存
    stationSelect = {
        provinceId: '',
        stationTypeId: '',
        myInput: ''
    };

    //设备筛选条件缓存
    equipmentSelect = {
        areaIds: '',
        classIds: '',
        deviceNoOrName: ''
    };
    //设备筛选条件缓存
    devicesSelect = {
        areaIds: '',
        classIds: '',
        deviceNoOrName: ''
    };

    constructor() {}

    getStationSelect() {
        return this.stationSelect;
    }

    setStationSelect(stationSelect) {
        this.stationSelect = stationSelect;
    }

    getEquipmentSelect() {
        return this.equipmentSelect;
    }
    getDevicesSelect() {
        return this.devicesSelect;
    }

    setEquipmentSelect(equipmentSelect) {
        this.equipmentSelect = equipmentSelect;
    }
}
