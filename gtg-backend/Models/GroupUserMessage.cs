using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class GroupUserMessage : ModelBase
{
    [MaxLength(20000)]
    public required string Message { get; set; }
    
    public Guid GroupUserId { get; set; }
    
    //Navigation Properties
    public GroupUser? GroupUser { get; set; }
}