export class StationPointsResp {
  pointId: number;
  importBatchNo: number;
  isDisplay: string;
  objId: string;
  objType: string;
  calcFormula: string;
  pointName: string;
  cateId: string;
  calcPeriod: string;
  dataPeriod: string;
  pointCategory: {
    cateId: string;
    calcPeriod: string;
    cateName: string;
    dataPeriod: string;
    dataType: string;
    displayGroup1: string;
    displayGroup2: string;
    displayOrder1: number,
    displayOrder2: number,
    displayOrder3: number,
    displayPrecision: number,
    importBatchNo: number,
    persistenceType: string;
    pointClass: string;
    pointUnit: string;
    propTypeId: string;
    remotionType: string;
    sysCateId: string;
    isDisplay: string;
    nullable: string;
  };
  currValue: number;
  historyValues: [
    {
      _id: number,
      pid: number,
      v: number,
      dt: number,
      t: number,
      q: number,
      oldValue: number,
    }
  ]
}