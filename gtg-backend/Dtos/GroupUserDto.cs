namespace gtg_backend.Dtos;

public class GroupUserDto
{
    public Guid Id { get; set; }
    public bool IsGroupAdmin { get; set; }
    public string Name { get; set; } = string.Empty;


    public List<GameLookupDto> OwnedGames { get; set; } = [];
}