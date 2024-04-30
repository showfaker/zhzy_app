export class DefectAdd {
    stationId:string;
    defectCode:number;
    shortName:string;
    reporter:string;
    reporterName:string;
    reportTime:string;
    defectSource:number;
    defectSourceText:string;
    stationStage:number;
    stationStageText:string;
    defectDeviceIds:string;
    defectDeviceIdsText:string;
    supplierId:number;
    supplierIdText:number;
    defectDesc:string;
    defectType:string ;//非必填
    defectLevel:string ;//非必填
    defectDeviceType:string ;//非必填
    defectTechType:string ;//非必填
    defectReason:string;
    elimiType:string;//默认01
    workOrder:{} = {};
}
