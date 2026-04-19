using System.Text;
using System.Text.Json;
using gtg_backend.Business;
using gtg_backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace gtg_backend.Controllers;

[Route("[controller]")]
public class NotificationController(INotificationService notificationService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> SendBroadcastToGroup([FromBody] GroupBroadcastRequestDto requestDto)
    {
        try
        {
            var id = new Guid(requestDto.GroupId);
            await notificationService.SendGroupNotificationAsync(requestDto.Message, new Guid(requestDto.GroupId));
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        
        
    }
}