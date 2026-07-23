export class Account {
  OBJECTID: number;
  GlobalID: string;
  AccountId: number;
  CsaId: number;
  TotalImpervious: number | null;
  TotalImperviousPrevious: number | null;
  CreditedImpervious: number | null;
  CreditedImperivousPrevious: number | null;
  BillableImpervious: number | null;
  BillableImperviousPrevious: number | null;
  ApportionmentUnits: number;
  PremiseCode: number;
  Status: string;
  BuildingType: string;
  Sfeu: number | null;
  SfeuPrevious: number | null;
  PremiseSfeu: number | null;
  ApportionmentCode: string;
  PremiseId: number;
  PinNumber: string;
  BillingTier: number;
  UseClass: string;
  RealEstateId: string;
  CCBUpdateFlag: string;
  created_user: string;
  created_date: number;
  last_edited_user: string;
  last_edited_date: number;
  // constructor unchanged
  constructor(
    OBJECTID: number,
    GlobalID: string,
    AccountId: number,
    CsaId: number,
    TotalImpervious: number,
    TotalImperviousPrevious: number,
    CreditedImpervious: number,
    CreditedImperivousPrevious: number,
    BillableImpervious: number,
    BillableImperviousPrevious: number,
    ApportionmentUnits: number,
    PremiseCode: number,
    Status: string,
    BuildingType: string,
    Sfeu: number,
    SfeuPrevious: number,
    PremiseSfeu: number,
    ApportionmentCode: string,
    PremiseId: number,
    PinNumber: string,
    BillingTier: number,
    UseClass: string,
    RealEstateId: string,
    CCBUpdateFlag: string,
    created_user: string,
    created_date: number,
    last_edited_user: string,
    last_edited_date: number,
  ) {
    this.OBJECTID = OBJECTID;
    this.GlobalID = GlobalID;
    this.AccountId = AccountId;
    this.CsaId = CsaId;
    this.TotalImpervious = Number.isNaN(TotalImpervious)
      ? null
      : TotalImpervious;
    this.TotalImperviousPrevious = Number.isNaN(TotalImperviousPrevious)
      ? null
      : TotalImperviousPrevious;
    this.CreditedImpervious = Number.isNaN(CreditedImpervious)
      ? null
      : CreditedImpervious;
    this.CreditedImperivousPrevious = Number.isNaN(CreditedImperivousPrevious)
      ? null
      : CreditedImperivousPrevious;
    this.BillableImpervious = Number.isNaN(BillableImpervious)
      ? null
      : BillableImpervious;
    this.BillableImperviousPrevious = Number.isNaN(BillableImperviousPrevious)
      ? null
      : BillableImperviousPrevious;
    this.ApportionmentUnits = ApportionmentUnits;
    this.PremiseCode = PremiseCode;
    this.Status = Status;
    this.BuildingType = BuildingType;
    this.Sfeu = Number.isNaN(Sfeu) ? null : Sfeu;
    this.SfeuPrevious = Number.isNaN(SfeuPrevious) ? null : SfeuPrevious;
    this.PremiseSfeu = Number.isNaN(PremiseSfeu) ? null : PremiseSfeu;
    this.ApportionmentCode = ApportionmentCode;
    this.PremiseId = PremiseId;
    this.PinNumber = PinNumber;
    this.BillingTier = BillingTier;
    this.UseClass = UseClass;
    this.RealEstateId = RealEstateId;
    this.CCBUpdateFlag = CCBUpdateFlag;
    this.created_user = created_user;
    this.created_date = created_date;
    this.last_edited_user = last_edited_user;
    this.last_edited_date = last_edited_date;
  }
}
