using gtg_backend.Models;

namespace gtg_backend.Dtos;

public class MeetDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string MeetType { get; set; }
    public bool HasMovies { get; set; }
    public bool HasGames { get; set; }
    public Guid GroupId { get; set; }
    
    public ICollection<MeetActivity>? MeetActivities { get; set; }
    public ICollection<MeetDateSuggestionDto>? MeetDateSuggestions { get; set; }
    public ICollection<MeetUserDto>? MeetUsers { get; set; }
}