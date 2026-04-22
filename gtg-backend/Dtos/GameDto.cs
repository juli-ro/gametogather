namespace gtg_backend.Dtos;

public class GameDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public int MinPlayerNumber { get; set; }
    public int MaxPlayerNumber { get; set; }
    public int PlayTime { get; set; }
    public int YearPublished { get; set; }
    public int MinAge { get; set; }
}