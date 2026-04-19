using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class MeetUserMessage : ModelBase
{
    [MaxLength(20000)]
    public required string Message { get; set; }
    
    public Guid MeetUserId { get; set; }
    
    //Navigation Properties
    public MeetUser? MeetUser { get; set; }
}