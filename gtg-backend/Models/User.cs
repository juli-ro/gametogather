using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class User : ModelBase
{
    [MaxLength(255)]
    public required string Name { get; set; }
    
    [MaxLength(255)]
    public string? FirstName { get; set; }
    [MaxLength(255)]
    public string? LastName { get; set; }
    [MaxLength(255)]
    public string? Email { get; set; }
    [MaxLength(255)]
    public required string Password { get; set; }
    [MaxLength(255)]
    public required string Salt { get; set; }
    public Guid RoleId { get; set; }
    
    //Navigation Properties
    public Role? Role { get; set; }
    public ICollection<Game>? Games { get; set; }
    public ICollection<GroupUser>? GroupUsers { get; set; }
    public ICollection<MeetUser>? MeetUsers { get; set; }
}