using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class Image : ModelBase
{
    [MaxLength(255)]
    public string? Name { get; set; }
    public byte[]? ImageData { get; set; }
    
    //Navigation Properties
    public ICollection<Game>? Games { get; set; }
}