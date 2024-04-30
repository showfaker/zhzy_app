import { RunlogReq } from "./runlog-req";

export class RunlogResp {
    content: RunlogReq[];
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    sort: any;
    totalElements: number;
    totalPages: number
}