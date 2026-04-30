using gtg_backend.Models;

namespace gtg_backend.Dtos;

public class MeetUserDto
{
    public Guid Id { get; set; }
    public bool IsHost { get; set; }
    public bool IsParticipating { get; set; }
    public string? Name { get; set; }
    public UserDto User { get; set; }
    public ICollection<MeetUserVoteSummaryDto> MeetUserVotes { get; set; }
}