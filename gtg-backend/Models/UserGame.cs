namespace gtg_backend.Models;

public class UserGame: ModelBase
{
    public Guid GameId { get; set; }
    public Guid UserId { get; set; }
    
    public Game Game { get; set; } = null!;
    public User User { get; set; } = null!;
}