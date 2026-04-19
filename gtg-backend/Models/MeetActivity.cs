namespace gtg_backend.Models;

public class MeetActivity : ModelBase
{
    public Guid ActivityId { get; set; }
    public Guid MeetId { get; set; }
    
    //Navigation Properties
    public Activity? Activity { get; set; }
    public Meet? Meet { get; set; }
}