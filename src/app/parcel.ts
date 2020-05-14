export class Parcel {
    OBJECTID: number;
    GlobalID: string;
    PinNumber: string;
    Owner: string;
    SiteAddress: string;
    FullStreetName: string;
    DeedAcres: number;
    LandClass: string;
    TypeUse: string;
    RealEstateId: string;
    ParcelPk: number;
    City: string;
    created_user: string;
    created_date: number;
    last_edited_user: string;
    last_edited_date: number;
    constructor(
        OBJECTID?: number,
        GlobalID?: string,
        PinNumber?: string,
        Owner?: string,
        SiteAddress?: string,
        FullStreetName?: string,
        DeedAcres?: number,
        LandClass?: string,
        TypeUse?: string,
        RealEstateId?: string,
        ParcelPk?: number,
        City?: string,
        created_user?: string,
        created_date?: number,
        last_edited_user?: string,
        last_edited_date?: number) {
            this.OBJECTID = OBJECTID;
            this.GlobalID = GlobalID;
            this.PinNumber = PinNumber;
            this.Owner = Owner;
            this.SiteAddress = SiteAddress;
            this.FullStreetName = FullStreetName;
            this.DeedAcres = DeedAcres;
            this.LandClass = LandClass;
            this.TypeUse = TypeUse;
            this.RealEstateId = RealEstateId;
            this.ParcelPk = ParcelPk;
            this.City = City;
            this.created_user = created_user;
            this.created_date = created_date;
            this.last_edited_user = last_edited_user;
            this.last_edited_date = last_edited_date;            
        }
}
