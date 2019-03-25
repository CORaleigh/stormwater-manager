import { Bill } from "./bill";
import { StormwaterBill } from "./stormwater-bill";
import { BillService } from "./bill-service";

export class BillingInfo {
    premiseId: string;
    address: string;
    accountId: string;
    entityName: string;
    saStatusFlag: string;
    saTypeCd: string;
    serviceAgreementId: string;
    lastBill: Bill;
    lastStormwaterBill: StormwaterBill;
    services: BillService[];

}
