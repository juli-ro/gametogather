namespace gtg_backend.Models;

public class GroupUser : ModelBase
{
    public bool IsGroupAdmin { get; set; }
    public Guid GroupId { get; set; }
    public Guid UserId { get; set; }
    
    
    //Navigation Properties
    public Group? Group { get; set; }
    public User? User { get; set; }      
    
    public ICollection<GroupUserMessage>? GroupUserMessages { get; set; }
    public ICollection<GroupUserVote>? GroupUserVotes { get; set; }
}