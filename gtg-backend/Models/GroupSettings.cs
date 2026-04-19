using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class GroupSettings : ModelBase
{
    public Guid GroupId { get; set; }
    
    [MaxLength(255)]
    public string? TelegramChatIdentification { get; set; }

    //Navigation Properties
    public Group? Group { get; set; }


}