namespace gtg_backend.Business;

public interface INotificationService
{
    public Task SendGroupNotificationAsync(string message, Guid groupId);
}
