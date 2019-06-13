export class Impervious {
    OBJECTID: number;
    GlobalId: string;
    AccountId: number;
    ImperviousId: number;
    TotalImpervious: number;
    BuildingImpervious: number;
    MiscImpervious: number;
    OtherImpervious: number;
    RecreationImpervious: number;
    RoadTrailImpervious: number;
    ParkingImpervious: number;
    PermittedImpervious: number;
    MethodUsed: string;
    MethodDate: number;
    EffectiveDate: number;
    Status: string;
    created_user: string;
    created_date: number;
    last_edited_user: string;
    last_edited_date: number;
    constructor(
        AccountId?: number,
        TotalImpervious?: number,
        BuildingImpervious?: number,
        MiscImpervious?: number,
        OtherImpervious?: number,
        RecreationImpervious?: number,
        RoadTrailImpervious?: number,
        ParkingImpervious?: number,
        PermittedImpervious?: number,
        MethodUsed?: string,
        MethodDate?: number,
        EffectiveDate?: number,
        Status?: string,
        ImperviousId?: number,
        created_user?: string,
        created_date?: number,
        last_edited_user?: string,
        last_edited_date?: number,
        OBJECTID?: number,
        GlobalId?: string,             
    ){
        this.OBJECTID = OBJECTID;
        this.GlobalId = GlobalId;
        this.AccountId = AccountId;
        this.ImperviousId = ImperviousId;
        this.TotalImpervious = TotalImpervious;
        this.BuildingImpervious = BuildingImpervious;
        this.MiscImpervious = MiscImpervious;
        this.OtherImpervious = OtherImpervious;
        this.RecreationImpervious = RecreationImpervious;
        this.RoadTrailImpervious = RoadTrailImpervious;
        this.ParkingImpervious = ParkingImpervious;
        this.PermittedImpervious = PermittedImpervious;
        this.MethodUsed = MethodUsed;
        this.MethodDate = MethodDate;
        this.EffectiveDate = EffectiveDate;
        this.Status = Status;
        this.created_user = created_user;
        this.created_date = created_date;
        this.last_edited_user = last_edited_user;
        this.last_edited_date = last_edited_date;    
    }
}
