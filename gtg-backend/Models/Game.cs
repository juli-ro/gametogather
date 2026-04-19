using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class Game : ModelBase
{
    [MaxLength(255)]
    public string? Name { get; set; }
    public int MinPlayerNumber { get; set; }
    public int MaxPlayerNumber { get; set; }
    public int PlayTime { get; set; }
    public Guid? UserId { get; set; }
    public Guid? GenreId { get; set; }
    public Guid? ImageId { get; set; }
    
    //Navigation Properties
    public User? User { get; set; }
    public GameGenre? GameGenre { get; set; }
    public Image? Image { get; set; }
  
}