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
public class MeetUserVoteController : BaseController<MeetUserVote, MeetUserVoteDto>
{
    public MeetUserVoteController(GameDbContext context, IMapper mapper) : base(context, mapper, context.MeetUserVote)
    {
    }

    public override async Task<IActionResult> GetAll()
    {
        List<MeetUserVote>? itemList = await _dbSet.ToListAsync();
        List<MeetUserVoteDto>? dtoList = _mapper.Map<List<MeetUserVoteDto>>(itemList);

        return Ok(dtoList);
    }

    [HttpPost]
    public override async Task<IActionResult> CreateItem([FromBody] MeetUserVoteDto? dto)
    {
        if (!ModelState.IsValid)
        {
            // Return detailed model binding errors
            return BadRequest(ModelState);
        }
        if (dto == null)
        {
            return BadRequest();
        }
    
        MeetUserVote? item = _mapper.Map<MeetUserVote>(dto);
        item.Id = Guid.NewGuid();
        EntityEntry<MeetUserVote> entity = _dbSet.Add(item);
        var saveResult = await _context.SaveChangesAsync();
        MeetUserVoteDto entityDto = _mapper.Map<MeetUserVoteDto>(entity.Entity);
        //Todo: temporary fix - seems unclean should probably be fixed later!
        entityDto.MeetUser.Name = dto.MeetUser.Name;
        return Ok(entityDto);
    }

    [HttpGet("MeetingVotes/{meetId}")]
    public async Task<IActionResult> GetMeetingVotes(Guid meetId)
    {
        var meet = await _context.Meets
            .Include(x => x.MeetUsers)
            .ThenInclude(meetUser => meetUser.MeetUserVotes)
            .Include(x => x.MeetUsers)
            .ThenInclude(meetUser => meetUser.User)
            .FirstOrDefaultAsync(meet => meet.Id == meetId);
        if (meet == null)
        {
            return BadRequest();
        }
        var voteList = new List<MeetUserVoteDto>();

        foreach (var meetUser in meet.MeetUsers)
        {
           List<MeetUserVoteDto>? meetUserVoteDtoList = _mapper.Map<List<MeetUserVoteDto>>(meetUser?.MeetUserVotes);
           voteList.AddRange(meetUserVoteDtoList);
        }


        return Ok(voteList);
    }
}