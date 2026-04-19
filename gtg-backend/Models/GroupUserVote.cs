using gtg_backend.Enums;

namespace gtg_backend.Models;

public class GroupUserVote : ModelBase
{
    public double Rating { get; set; }
    public Guid VotableItemId { get; set; }
    public VotableItemType VotableItemType { get; set; }
    
    public Guid GroupUserId { get; set; }
    
    //Navigation Properties
    public GroupUser? GroupUser { get; set; }
}