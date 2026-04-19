using gtg_backend.Models;

namespace gtg_backend.Dtos;

public class UserDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? RoleName { get; set; }
    
    //Todo: think about leaving this out
    public ICollection<GameDto> Games { get; set; }
}