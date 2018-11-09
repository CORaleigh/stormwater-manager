export class Credit {
    last_edited_user: string;
    last_edited_date: number;
    created_date: number;
    AccountId: number;
    InceptionDate: number;
    ExpirationDate: number;
    ApprovalDate: number;
    Comment: string;
    OnSiteCode: string;
    UpstreamCode: string;
    NpdesPercentage: number;
    ControlledAcreage: number;
    ControlledSurface: number;
    created_user: string;
    OBJECTID: number;
    GlobalId: string;
    constructor(
        AccountId: number,
        InceptionDate: number,
        ExpirationDate: number,
        ApprovalDate: number,
        Comment: string,
        OnSiteCode: string,
        UpstreamCode: string,
        NpdesPercentage: number,
        ControlledAcreage: number,
        ControlledSurface: number,
        created_user?: string,
        created_date?: number,    
        last_edited_user?: string,
        last_edited_date?: number,
        OBJECTID?: number,
        GlobalId?: string
    ) {

            this.OBJECTID = OBJECTID;
            this.GlobalId = GlobalId;
            this.AccountId = AccountId;
            this.InceptionDate = InceptionDate;
            this.ExpirationDate = ExpirationDate;
            this.ApprovalDate = ApprovalDate;
            this.Comment = Comment;
            this.OnSiteCode = OnSiteCode;
            this.UpstreamCode = UpstreamCode;
            this.NpdesPercentage = NpdesPercentage;
            this.ControlledAcreage = ControlledAcreage;
            this.ControlledSurface = ControlledSurface;
            this.created_user = created_user;
            this.created_date = created_date;    
            this.last_edited_user = last_edited_user;
            this.last_edited_date = last_edited_date;
    }
}
