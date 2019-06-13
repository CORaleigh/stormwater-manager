export class Account {
    OBJECTID: number;
    GlobalID: string;
    AccountId: number;
    CsaId: number;
    TotalImpervious: number;
    TotalImperviousPrevious: number;
    CreditedImpervious: number;
    CreditedImperivousPrevious: number;
    BillableImpervious: number;
    BillableImperviousPrevious: number;
    ApportionmentUnits: number;
    PremiseCode: number;
    Status: string;
    BuildingType: string;
    Sfeu: number;
    SfeuPrevious: number;
    ApportionmentCode: string;
    PremiseId: number;
    PinNumber: string;
    BillingTier: number;
    UseClass:string;
    RealEstateId: string;
    CCBUpdateFlag: string;
    created_user: string;
    created_date: number;
    last_edited_user: string;
    last_edited_date: number;
    constructor(
        OBJECTID: number,
        GlobalID: string,
        AccountId: number,
        CsaId: number,
        TotalImpervious: number,
        CreditedImpervious: number,
        BillableImpervious: number,
        ApportionmentUnits: number,
        PremiseCode: number,
        Status: string,
        BuildingType: string,
        Sfeu: number,
        SfeuPrevious: number,
        ApportionmentCode: string,
        PremiseId: number,
        PinNumber: string,
        BilingTier:number,
        UseClass: string,
        RealEstateId: string,
        CCBUpdateFlag: string,
        created_user: string,
        created_date: number,
        last_edited_user: string,
        last_edited_date: number
    ) {
        
        this.OBJECTID = OBJECTID;
        this.GlobalID = GlobalID;
        this.AccountId = AccountId;
        this.CsaId = CsaId;
        this.TotalImpervious = Number.isNaN(TotalImpervious) ? null : TotalImpervious;
        this.CreditedImpervious = Number.isNaN(CreditedImpervious) ? null : CreditedImpervious;
        this.BillableImpervious = Number.isNaN(BillableImpervious) ? null : BillableImpervious;
        this.ApportionmentUnits = ApportionmentUnits;
        this.PremiseCode = PremiseCode;
        this.Status = Status;
        this.BuildingType = BuildingType;
        this.Sfeu = Number.isNaN(Sfeu) ? null : Sfeu;
        this.SfeuPrevious = Number.isNaN(SfeuPrevious) ? null : SfeuPrevious;
        this.ApportionmentCode = ApportionmentCode;
        this.PremiseId = PremiseId;
        this.PinNumber = PinNumber;
        this.BillingTier = BilingTier;
        this.UseClass = UseClass;
        this.RealEstateId = RealEstateId;
        this.CCBUpdateFlag = CCBUpdateFlag;
        this.created_user = created_user;
        this.created_date = created_date;
        this.last_edited_user = last_edited_user;
        this.last_edited_date = last_edited_date;
    }

}
