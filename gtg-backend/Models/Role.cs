using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class Role : ModelBase
{
    [MaxLength(255)]
    public required string Name { get; set; }
    
    //Navigation Properties
    public ICollection<User>? Users { get; set; }
}