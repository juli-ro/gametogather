using gtg_backend.Enums;

namespace gtg_backend.Dtos;

public class MeetUserVoteDto
{
    public Guid Id { get; set; }
    public double? Rating { get; set; }
    public Guid VotableItemId { get; set; }
    public String VotableItemType { get; set; }
    public MeetUserDto MeetUser { get; set; }
}