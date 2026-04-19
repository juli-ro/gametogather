using gtg_backend.Business;
using gtg_backend.Data;
using Microsoft.EntityFrameworkCore;

namespace gtg_backend.Helpers;

public class NotificationWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    
    public NotificationWorker(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;   
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<GameDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                
                await Process(context, notificationService);
            }
            await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken);
        }
    }
    
    private async Task Process(GameDbContext context, INotificationService notificationService)
    {
        var now = DateTime.UtcNow;
        var oneHourAgo = now.AddHours(-1);

        var meetings = await context.Meets
            .Where(m =>
                m.UpdatedAt >= oneHourAgo 
                &&
                (m.LastNotificationSentAt == DateTime.MinValue ||
                 m.LastNotificationSentAt < m.UpdatedAt))
            .ToListAsync();

        foreach (var meet in meetings)
        {
            string message = $"The meeting {meet.Name} has recently been updated";
            await notificationService.SendGroupNotificationAsync(message, meet.GroupId);

        }
        
        await context.Meets
            .Where(m => m.UpdatedAt >= oneHourAgo &&
                        (m.LastNotificationSentAt == DateTime.MinValue || 
                         m.LastNotificationSentAt < m.UpdatedAt))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(m => m.LastNotificationSentAt, now));
        

        await context.SaveChangesAsync();

    }

}