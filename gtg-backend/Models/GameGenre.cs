using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class GameGenre : ModelBase
{
    [MaxLength(255)]
    public required string Name { get; set; }
    
    public Guid GroupId { get; set; }
    
    //Navigation Properties
    public Group? Group { get; set; }
    public ICollection<Game>? Games { get; set; }
}