import { RunlogReq } from './runlog-req';
export class PrepLogDetailResp {
    monthEnergy:string;
    station:any;
    lastJobRecord: RunlogReq;
}
// let obj = {
//     "monthEnergy": "3600.000000",
//     "station":
//         {
//             "stationId": "00031",
//             "stationName": "山东东营力诺20MWp地面集中式光伏电站",
//             "shortName": "东营力诺",
//             "timezone": "0054",
//             "address": "山东东营河口区新户镇南六合村",
//             "postcode": null,
//             "longitude": "118.312595",
//             "latitude": "37.906691",
//             "countryId": "CN", "countryName": "中华人民共和国", "provinceId": "370000",
//             "provinceName": "山东", "cityId": "370500", "cityName": "东营", "countyId":
//                 "370502", "countyName": "东营", "designComp": null, "designCompName": null,
//             "construnctComp": "00035", "construnctCompName": "山东林洋新能源电力有限公司光伏电站运维公司",
//             "powerComp": null, "powerCompName": null, "projectComp": null, "projectCompName": null,
//             "propertyComp": "01156", "propertyCompName": "冠县华博农业科技有限公司", "customerId": "00000001",
//             "customerName": "江苏林洋能源股份有限公司", "deptId": "0000000251", "deptName": "东营力诺20MW电站",
//             "parentDeptId": "0000000029", "parentDeptName": "山东分中心", "area": null, "capacity": 20.0,
//             "connectionMode": null, "connectionModeText": null, "voltageLevel": "04", "voltageLevelText":
//                 "10kV", "elevation": null, "elevationText": null, "finishDate": "2016-01-31", "operationDate":
//                 "2016-01-31", "introduction": null, "psrId": "9607", "stationMaster": "00001004", "stationMasterName":
//                 "周建东", "stationStatus": "04", "stationStatusText": "已接入系统", "stationType": "02", "stationTypeText":
//                 "山地电站", "modelLayout": null, "modelLayoutText": null, "modelAngle": null, "modelAngleText": null, "collStationId": null, "stationCode": "00031", "parallelCapacity": null, "attributes": {}, "areas": null, "points": null
//         },
//     "lastJobRecord": {
//         "recordId": 35, "customerId": "00000001", "dailyEnergy": 3600.000000, "dailyLoss": null, "genHours": 12.080000, "genHoursCloudy": 3.000000, "genHoursFine": 4.000000, "genHoursPcloud": 5.000000, "genHoursRain": 0.040000, "genHoursWet": 0.040000, "irradiation": null, "maxPower": 1.000100, "maxTemp": null, "memo": null, "meterRatio": 9, "meterValue": 400.000000, "minTemp": null, "parallelCapacity": 20.000000, "powerOutage": null, "recordTime": 1517195521000, "recordType": "01", "recordTypeText": null, "recorder": "000001", "recorderName": null, "reportDate": "2018-01-01", "stationId": "00031", "weatherInfo": "小雪转雨夹雪", "windDirection": null, "windSpeed": null, "monthEnergy": null
//     }
// }