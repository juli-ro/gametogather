using gtg_backend.Models;

namespace gtg_backend.Dtos;

public class GroupDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }      
    
    // public ICollection<GroupUser>? GroupUsers { get; set; }
    // public ICollection<Activity>? Activities { get; set; }
    // public ICollection<GameGenre>? GameGenres { get; set; }
    // public ICollection<Meet>? Meets { get; set; }

}