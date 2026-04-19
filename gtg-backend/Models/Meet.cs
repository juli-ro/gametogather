using System.ComponentModel.DataAnnotations;

namespace gtg_backend.Models;

public class Meet : ModelBase, INotificationModel
{
    [MaxLength(255)]
    public required string MeetType { get; set; }
    [MaxLength(255)]
    public required string Name { get; set; }
    public bool HasMovies { get; set; }
    public bool HasGames { get; set; }
    public Guid GroupId { get; set; }
    public DateTime LastNotificationSentAt { get; set; }
    
    //Navigation Properties
    public Group? Group { get; set; }
    public ICollection<MeetActivity> MeetActivities { get; set; } = new List<MeetActivity>();
    public ICollection<MeetDateSuggestion> MeetDateSuggestions { get; set; } = new List<MeetDateSuggestion>();
    public ICollection<MeetUser> MeetUsers { get; set; } = new List<MeetUser>();
}