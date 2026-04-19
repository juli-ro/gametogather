using gtg_backend.Enums;

namespace gtg_backend.Models;

public class MeetUserVote : ModelBase
{
    public double? Rating { get; set; }
    public Guid VotableItemId { get; set; }
    public VotableItemType VotableItemType { get; set; }
    
    public Guid MeetUserId { get; set; }
    
    //Navigation Properties
    public MeetUser? MeetUser { get; set; }
}