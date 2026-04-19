namespace gtg_backend.Models;

public class MeetUser : ModelBase
{
    public bool IsHost { get; set; }
    public Guid UserId { get; set; }
    public Guid MeetId { get; set; }
    
    //NavigationProperties
    public User? User { get; set; }
    public Meet? Meet { get; set; }
    
    public ICollection<Movie>? Movies { get; set; }
    public ICollection<Assignment>? Assignments { get; set; }
    public ICollection<Food>? Foods { get; set; }
    public ICollection<MeetUserMessage>? MeetUserMessages { get; set; }
    public ICollection<MeetUserVote> MeetUserVotes { get; set; } = new List<MeetUserVote>();
}