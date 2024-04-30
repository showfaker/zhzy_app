export class SampleStationsResp {
    content: SampleStationsRespContent[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    sort: string;
    first: boolean;
    numberOfElements: number
}
export class SampleStationsRespContent{
    shortName: string;
    stationId: string;
    stationName: string;
    psrId: string;
    deptId: string;
    provinceId: string;
    provinceName: string;
    stationStatus: string
}