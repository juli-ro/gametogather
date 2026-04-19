namespace gtg_backend.Models;

public class MeetDateSuggestion : ModelBase
{
    public DateTime Date { get; set; }
    public Guid MeetId { get; set; }
    public bool IsChosenDate { get; set; }
    
    //Navigation Properties 
    public Meet? Meet { get; set; }
}