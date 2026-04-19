using System.Security.Claims;
using AutoMapper;
using gtg_backend.Data;
using gtg_backend.Dtos;
using gtg_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace gtg_backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class MeetController : BaseController<Meet, MeetDto>
{
    public MeetController(GameDbContext context, IMapper mapper) : base(context, mapper, context.Meets)
    {
    }

    [HttpGet("GroupMeets/{groupId}")]
    public async Task<IActionResult> GetGroupMeets(Guid groupId)
    {
        List<Meet> meets = await _context.Meets
            .Include(meet => meet.MeetDateSuggestions)
            .Where(meet => meet.GroupId == groupId).ToListAsync();

        return Ok(meets);
    }
    
    [HttpGet("UserMeets")]
    public async Task<IActionResult> GetUserMeets()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        List<Meet> meets = await _context.Meets
            .Include(meet => meet.MeetUsers)
            .Include(meet => meet.MeetDateSuggestions)
            .Where(meet => meet.MeetUsers.Any(user => user.UserId == new Guid(userId))).ToListAsync();

        List<MeetDto> meetDtos = _mapper.Map<List<MeetDto>>(meets);
        
        return Ok(meetDtos);
    }

    [HttpGet("GetActiveMeets")]
    public async Task<IActionResult> GetActiveGroupMeets(Guid groupId)
    {
        List<Meet> meets = await _context.Meets
            .Include(meet => meet.MeetDateSuggestions)
            .Where(meet => meet.GroupId == groupId)
            .ToListAsync();

        List<Meet> activeMeets = meets.Where(meet => meet.MeetDateSuggestions
            .Any(meetDate => meetDate.Date >= DateTime.Now.Date && meetDate.IsChosenDate)).ToList();

        return Ok(activeMeets);
    }

    public override async Task<IActionResult> GetById(Guid id)
    {
        Meet? item = await _dbSet
            .Include(x => x.MeetDateSuggestions)
            .Include(x => x.MeetUsers)
            .ThenInclude(x => x.User)
            //Todo: Check if necessary
            .Include(x => x.MeetUsers)
            .ThenInclude(x => x.MeetUserVotes)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            return NotFound();
        }

        MeetDto? itemDto = _mapper.Map<MeetDto>(item);
        return Ok(itemDto);
    }

    [HttpPost("AddDate")]
    public async Task<IActionResult> AddDate([FromBody] MeetDateSuggestionDto dateSuggestionDto)
    {
        Meet? meet = await _context.Meets
            .Include(meet => meet.MeetDateSuggestions)
            .FirstOrDefaultAsync(x => x.Id == dateSuggestionDto.MeetId);

        if (meet == null)
        {
            return NotFound();
        }

        if (meet.MeetDateSuggestions.Any(x =>
                x.Date.ToLongDateString() == dateSuggestionDto.Date.ToLongDateString()))
        {
            return BadRequest();
        }

        MeetDateSuggestion dateSuggestion = _mapper.Map<MeetDateSuggestion>(dateSuggestionDto);
        await _context.MeetDateSuggestions.AddAsync(dateSuggestion);
        await _context.SaveChangesAsync();
        MeetDateSuggestionDto dateSuggestionDtoResponse = _mapper.Map<MeetDateSuggestionDto>(dateSuggestion);
        
        return Ok(dateSuggestionDtoResponse);
    }

    [HttpPost("CreateGroupMeet")]
    public async Task<IActionResult> CreateGroupMeet([FromBody] Group groupDto)
    {
        Group? group = await _context.Groups
            .Include(x => x.GroupUsers)
            .FirstOrDefaultAsync(x => x.Id == groupDto.Id);
        
        if (group == null)
        {
            return NotFound();
        }

        Meet newMeet = new Meet { MeetType = "newMeetPost", Name = $"new {group.Name} meet", GroupId = groupDto.Id };
        
        var result =_context.Meets.Add(newMeet);
        
        foreach (GroupUser groupUser in group.GroupUsers)
        {
            _context.MeetUsers.Add(new MeetUser { MeetId = result.Entity.Id, UserId = groupUser.UserId });
        }
        
        await _context.SaveChangesAsync();

        return Ok(result.Entity.Id);
    }

    [HttpGet("GetCurrentMeetUser/{meetId}")]
    public async Task<IActionResult> GetCurrentMeetUser(Guid meetId)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        MeetUser? meetUser = await _context.MeetUsers
            .Include(x => x.User)
            .Include(x => x.MeetUserVotes)
            .FirstOrDefaultAsync(x => x.UserId == new Guid(userId) && x.MeetId == meetId);
        if (meetUser == null)
        {
            return NotFound();
        }
        MeetUserDto meetUserDto = _mapper.Map<MeetUserDto>(meetUser);
        return Ok(meetUserDto);
    }

    [HttpPut("SelectDate")]
    public async Task<IActionResult> SelectDate([FromBody] MeetDateSuggestionDto dateSuggestionDto)
    {
        dateSuggestionDto.IsChosenDate = !dateSuggestionDto.IsChosenDate;
        MeetDateSuggestion dateSuggestion = _mapper.Map<MeetDateSuggestion>(dateSuggestionDto);
        if (dateSuggestion == null)
        {
            return NotFound();
        }
        _context.MeetDateSuggestions.Update(dateSuggestion);
        await _context.SaveChangesAsync();
        return Ok(dateSuggestionDto);
    }

    // [HttpPut("UpdateMeeting")]
    // public override async Task<IActionResult> UpdateItem([FromBody]MeetDto? itemDto)
    // {
    //     if (itemDto == null)
    //     {
    //         return BadRequest();
    //     }
    //     Meet? item = _mapper.Map<Meet>(itemDto);
    //     _dbSet.Update(item);
    //     await _context.SaveChangesAsync();
    //     return Ok(itemDto);
    // }
    
}