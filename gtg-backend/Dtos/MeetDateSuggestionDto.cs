using System.Text.Json.Serialization;
using gtg_backend.Models;

namespace gtg_backend.Dtos;

public class MeetDateSuggestionDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public Guid MeetId { get; set; }
    public bool IsChosenDate { get; set; }
}