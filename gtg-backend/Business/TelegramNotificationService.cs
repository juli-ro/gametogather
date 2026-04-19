using System.Text;
using System.Text.Json;
using gtg_backend.Data;
using gtg_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gtg_backend.Business;

public class TelegramNotificationService : INotificationService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly GameDbContext _context;

    public TelegramNotificationService(
        GameDbContext context,
        HttpClient httpClient,
    IConfiguration configuration)
    {
        _context = context;
        _httpClient = httpClient;
        _configuration = configuration;
    }
    
    public async Task SendGroupNotificationAsync (string message, Guid groupId)
    {
        var token = _configuration["Telegram:BotToken"];
        var url = $"https://api.telegram.org/bot{token}/sendMessage";

        string? chatId = await GetChatIdFromGroupId(groupId);
        if (chatId is null)
        {
            return;
        }

        var payload = new
        {
            chat_id = chatId,
            text = message
        };

        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json");

        await _httpClient.PostAsync(url, content);
    }

    private async Task<string?>GetChatIdFromGroupId(Guid groupId)
    {
        Group? group = await _context.Groups.Include(group => group.GroupSettings)
            .FirstOrDefaultAsync(group => group.Id == groupId);
        return group?.GroupSettings.TelegramChatIdentification;
    }
}