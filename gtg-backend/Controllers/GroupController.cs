using System.Security.Claims;
using AutoMapper;
using gtg_backend.Data;
using gtg_backend.Dtos;
using gtg_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace gtg_backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class GroupController : BaseController<Group, GroupDto>
{
    public GroupController(GameDbContext context, IMapper mapper) : base(context, mapper, context.Groups)
    {
    }

    [HttpGet("UserGroup")]
    public async Task<IActionResult> GetUserGroupsByUserId()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        List<Group> groupList = await _dbSet
            .Include(group => group.GroupUsers)
            .Where(group => group.GroupUsers.Any(groupUser => groupUser.UserId == new Guid(userId)))
            .ToListAsync();
        
        List<GroupDto>? groupDtoList = _mapper.Map<List<GroupDto>>(groupList);
        
        return Ok(groupDtoList);
    }

    [HttpGet("UserGroup/Settings/{groupId}")]
    public async Task<IActionResult> GetGroupSettingsFromGroupId(Guid groupId)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        //Get User
        var user = await _context.Users.Include(user => user.GroupUsers).FirstOrDefaultAsync(user => user.Id == new Guid(userId));

        if (user == null)
        {
            return BadRequest();
        }
        
        //Check if user is part of group 
        bool isGroupAdmin = await _context.GroupUsers.AnyAsync(groupUser => groupUser.UserId == user.Id && groupUser.GroupId == groupId);
        //Todo: maybe also check if groupAdmin
        // bool isGroupAdmin = await _context.GroupUsers.AnyAsync(groupUser => groupUser.UserId == user.Id && groupUser.GroupId == groupId && groupUser.IsGroupAdmin);

        if (!isGroupAdmin)
        {
            return Unauthorized();
        }
        
        var groupSettings = await _context.GroupSettings.FirstOrDefaultAsync(groupSettings => groupSettings.GroupId == groupId);
        
        GroupSettingsDto? groupSettingsDto = _mapper.Map<GroupSettingsDto>(groupSettings);
        
        return Ok(groupSettingsDto);
    }
    
    [HttpPut("GroupSettings")]
    public async Task<IActionResult> UpdateItem([FromBody]GroupSettingsDto? itemDto)
    {
        if (itemDto == null)
        {
            return BadRequest();
        }
        

        var groupToUpdate =  await _context.GroupSettings.FirstOrDefaultAsync(settings => settings.Id == itemDto.Id);
        if (groupToUpdate == null)
        {
            return BadRequest();
        }
        
        _mapper.Map(itemDto, groupToUpdate);
        // item.GroupId = groupToUpdate.GroupId;
        
        // _context.GroupSettings.Update(itemDto);
        await _context.SaveChangesAsync();
        return Ok(itemDto);
    }

    [HttpPost("UserGroup")]
    public async Task<IActionResult> CreateGroup()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        var user = await _context.Users.FirstOrDefaultAsync(user => user.Id == new Guid(userId));

        if (user == null)
        {
            return BadRequest();
        }

        var group = new Group{Name = "New Group"};
        group.GroupUsers = new List<GroupUser>{new GroupUser{UserId = user.Id}};
        
        EntityEntry<Group> entry = await _context.Groups.AddAsync(group);
        
        var groupSetting = new GroupSettings{GroupId = entry.Entity.Id};
        
        await _context.GroupSettings.AddAsync(groupSetting);
        
        await _context.SaveChangesAsync();
        return Ok(entry.Entity.Id);
    }
}