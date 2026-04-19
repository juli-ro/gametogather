using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class Movie : ModelBase
{
    [MaxLength(255)]
    public required string Name { get; set; }
    
    public Guid MeetUserId { get; set; }
    
    //Navigation Properties
    public MeetUser? MeetUser { get; set; }
}