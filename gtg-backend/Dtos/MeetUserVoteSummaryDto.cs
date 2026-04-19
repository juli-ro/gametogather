namespace gtg_backend.Dtos;

public class MeetUserVoteSummaryDto
{
    public Guid Id { get; set; }
    public double? Rating { get; set; }
    public Guid VotableItemId { get; set; }
    public String VotableItemType { get; set; }
}