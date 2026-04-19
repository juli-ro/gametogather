using System.ComponentModel.DataAnnotations;
using gtg_backend.Enums;

namespace gtg_backend.Models;

public class Food : ModelBase
{
    [MaxLength(255)]
    public required string Name { get; set; }
    public int Quantity { get; set; }
    public FoodType FoodType { get; set; }
    
    public Guid MeetUserId { get; set; }
    
    //Navigation Properties
    public MeetUser? MeetUser { get; set; }
    
}