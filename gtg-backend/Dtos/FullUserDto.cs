namespace gtg_backend.Dtos;

public class FullUserDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? RoleName { get; set; }
    public string? Email { get; set; }
}