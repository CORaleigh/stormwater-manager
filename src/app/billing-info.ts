import { Bill } from "./bill";
import { StormwaterBill } from "./stormwater-bill";
import { BillService } from "./bill-service";

export class BillingInfo {
    premId: string;
    address: string;
    acctId: string;
    entityName: string;
    status: string;
    lastBill: Bill;
    lastStormwaterBill: StormwaterBill;
    services: BillService[];

}
