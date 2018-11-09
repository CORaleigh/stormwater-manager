export class Log {
    OBJECTID: number;
    GlobalId: string;
    AccountId: number;
    LogEntry: string;
    PremiseId: string;
    created_user: string;
    created_date: number;
    last_edited_user: string;
    last_edited_date: number;
    constructor(
        OBJECTID: number,
        GlobalId: string,
        AccountId: number,
        LogEntry: string,
        PremiseId: string,
        created_user: string,
        created_date: number,
        last_edited_user: string,
        last_edited_date: number      
                
    ) {
        this.OBJECTID = OBJECTID;
        this.GlobalId = GlobalId;
        this.AccountId = AccountId;
        this.LogEntry = LogEntry;
        this.PremiseId = PremiseId;
        this.created_user = created_user;
        this.created_date = created_date;
        this.last_edited_user = last_edited_user;
        this.last_edited_date = last_edited_date;
        
    }
}
