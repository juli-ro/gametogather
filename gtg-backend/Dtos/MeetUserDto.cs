using gtg_backend.Models;

namespace gtg_backend.Dtos;

public class MeetUserDto
{
    //Todo: possibly add MeetUserVote
    public Guid Id { get; set; }
    public bool IsHost { get; set; }
    public string? Name { get; set; }
    public UserDto User { get; set; }
    public ICollection<MeetUserVoteSummaryDto> MeetUserVotes { get; set; }
}