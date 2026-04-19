using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class Activity : ModelBase
{
    [MaxLength(255)]
    public required string Name { get; set; }
    [MaxLength(10000)]
    public required string ActivityDescription { get; set; }
    public Guid GroupId { get; set; }
    
    //Navigation Properties
    public Group? Group { get; set; }
    
    public ICollection<MeetActivity>? MeetActivities { get; set; }
}