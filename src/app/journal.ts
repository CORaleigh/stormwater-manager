export class Journal {
    OBJECTID: number;
    GlobalId: string;
    AccountId: number;
    JournalEntry: string;
    created_user: string;
    created_date: number;
    last_edited_user: string;
    last_edited_date: number;
    constructor(
        AccountId: number,
        JournalEntry: string,
        created_user?: string,
        created_date?: number,
        last_edited_user?: string,
        last_edited_date?: number,
        OBJECTID?: number,
        GlobalId?: string        
    ) 
    {
        this.OBJECTID = OBJECTID;
        this.GlobalId = GlobalId;
        this.AccountId = AccountId;
        this.JournalEntry = JournalEntry;
        this.created_user = created_user;
        this.created_date = created_date;
        this.last_edited_user = last_edited_user;
        this.last_edited_date = last_edited_date;    
    }
}
