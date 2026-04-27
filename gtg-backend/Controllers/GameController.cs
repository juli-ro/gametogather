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
        List<Game> itemList = await _dbSet
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
        Game? item = _mapper.Map<Game>(dto);
        item.Id = Guid.NewGuid();
        EntityEntry<Game> entity = _dbSet.Add(item);
        await _context.SaveChangesAsync();  
        GameDto entityDto = _mapper.Map<GameDto>(entity.Entity);
        return Ok(entityDto);
    }

    [HttpPost("AddUserGame")]
    public async Task<IActionResult> AddUserGame([FromBody] GameDto? dto)
    {
        if (dto == null)
        {
            return BadRequest();
        }
        
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId == null)
        {
            return Unauthorized();
        }
        
        Guid userGuid = Guid.Parse(userId);

        UserGame newUserGame = new UserGame { UserId = userGuid, GameId = dto.Id };

        if (_context.UserGames.Any(x => newUserGame.GameId == x.GameId && newUserGame.UserId == x.UserId))
        {
            return Conflict();
        }
        
        _context.UserGames.Add(new UserGame { UserId = new Guid(userId), GameId = dto.Id });

        await _context.SaveChangesAsync();
        return Ok(dto);

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
        Game? item = _mapper.Map<Game>(itemDto);
        _dbSet.Update(item);
        await _context.SaveChangesAsync();
        GameDto resultDto = _mapper.Map<GameDto>(item);
        
        return Ok(resultDto);
    }


    [HttpGet("UserGames")]
    public async Task<IActionResult> GetUserGamesByUserId()
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        List<Game> itemList = await _context.UserGames
            // .Include(userGame => userGame.Game)
            .Where(x => x.UserId == new Guid(userId))
            .Select(y => y.Game)
            .ToListAsync();
 
        List<GameDto>? dtoList = _mapper.Map<List<GameDto>>(itemList);

        return Ok(dtoList);
    }
    
    
    [HttpDelete("RemoveUserGame/{gameId:guid}")]
    public async Task<IActionResult> RemoveUserGame(Guid gameId)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        UserGame? entryToDelete = await _context.UserGames.FirstOrDefaultAsync(ug => ug.GameId == gameId && ug.UserId == Guid.Parse(userId));

        if (entryToDelete == null)
        {
            return NotFound();
        }
        
        _context.UserGames.Remove(entryToDelete);

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GroupGames/{groupId:guid}")]
    public async Task<IActionResult> GetGroupGames(Guid groupId)
    {
        var groupGameList = await _context.GroupUsers
            .Where(gu => gu.GroupId == groupId)
            .SelectMany(gu => gu.User!.UserGames)
            .Select(ug => ug.Game)
            .Distinct()
            .AsNoTracking()
            .ToListAsync();
        
        List<GameDto>? dtoList = _mapper.Map<List<GameDto>>(groupGameList);

        return Ok(dtoList);
    }


    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(Guid id)
    {
        Game? item = await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(game => game.Id == id);
        if (item == null)
        {
            return NotFound();
        }

        GameDto? itemDto = _mapper.Map<GameDto>(item);
        return Ok(itemDto);
    }
}