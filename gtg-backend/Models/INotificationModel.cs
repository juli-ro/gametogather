namespace gtg_backend.Models;

public interface INotificationModel
{
    public Guid Id { get; set; }

    DateTime LastNotificationSentAt { get; set; }
}