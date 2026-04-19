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
public class GameController : BaseController<Game, GameDto>
{
    public GameController(GameDbContext context, IMapper mapper) : base(context, mapper, context.Games)
    {
    }

    [HttpGet]
    public override async Task<IActionResult> GetAll()
    {
        List<Game>? itemList = await _dbSet
            .Include(game => game.User)
            .ToListAsync();
        List<GameDto>? dtoList = _mapper.Map<List<GameDto>>(itemList);

        return Ok(dtoList);
    }

    [HttpPost]
    public override async Task<IActionResult> CreateItem([FromBody] GameDto? dto)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        if (dto == null)
        {
            return BadRequest();
        }
        dto.UserId = new Guid(userId);
        Game? item = _mapper.Map<Game>(dto);
        item.Id = Guid.NewGuid();
        EntityEntry<Game> entity = _dbSet.Add(item);
        await _context.SaveChangesAsync();  
        GameDto entityDto = _mapper.Map<GameDto>(entity.Entity);
        return Ok(entityDto);
    }
    
    [HttpPut]
    public override async Task<IActionResult> UpdateItem([FromBody]GameDto? itemDto)
    {
        if (itemDto == null)
        {
            return BadRequest();
        }
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        itemDto.UserId = new Guid(userId);
        Game? item = _mapper.Map<Game>(itemDto);
        _dbSet.Update(item);
        await _context.SaveChangesAsync();
        return Ok(itemDto);
    }


    [HttpGet("UserGames")]
    // [Route("UserGames/{id}")]
    public async Task<IActionResult> GetUserGamesByUserId()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        List<Game>? itemList = await _dbSet
            .Include(game => game.User)
            .Where(game => game.UserId == new Guid(userId))
            .ToListAsync();
        List<GameDto>? dtoList = _mapper.Map<List<GameDto>>(itemList);

        return Ok(dtoList);
    }

    [HttpGet("GroupGames/{groupId}")]
    public async Task<IActionResult> GetGroupGames(Guid groupId)
    {
        var groupUsers = await _context.GroupUsers
            .Include(groupUser => groupUser.User)
            .ThenInclude(user => user.Games)
            .Where(group => group.GroupId == groupId)
            .ToListAsync();

        List<Game> gameList = new List<Game>();

        foreach (var groupUser in groupUsers)
        {
            if (groupUser?.User?.Games != null)
            {
                var userGames = groupUser.User.Games.ToList();
                gameList.AddRange(userGames);
            }
        }


        List<GameDto>? dtoList = _mapper.Map<List<GameDto>>(gameList);

        return Ok(dtoList);
    }

    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(Guid id)
    {
        Game? item = await _dbSet
            .Include(game => game.User)
            .FirstOrDefaultAsync(game => game.Id == id);
        if (item == null)
        {
            return NotFound();
        }

        GameDto? itemDto = _mapper.Map<GameDto>(item);
        return Ok(itemDto);
    }
}