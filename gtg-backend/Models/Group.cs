using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class Group : ModelBase
{
    [MaxLength(255)]
    public required string Name { get; set; }      
    
    //Navigation Settings
    
    public GroupSettings GroupSettings { get; set; } = new GroupSettings();
    public ICollection<GroupUser> GroupUsers { get; set; } = new List<GroupUser>();
    public ICollection<Activity>? Activities { get; set; }
    public ICollection<GameGenre>? GameGenres { get; set; }
    public ICollection<Meet>? Meets { get; set; }
}