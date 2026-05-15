using System.Security.Claims;
using AutoMapper;
using gtg_backend.Data;
using gtg_backend.Dtos;
using gtg_backend.Models;
using gtg_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace gtg_backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    
    public GameController(IGameService gameService)
    {
        _gameService = gameService;
    }
    
    private Guid? GetUserId()
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return userIdString != null ? Guid.Parse(userIdString) : null;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        List<GameDto> result = await _gameService.GetAllGamesAsync();
        return Ok(result);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        GameDto? result = await _gameService.GetGameByIdAsync(id);
        if (result == null) return NotFound();
        
        return Ok(result);
    }
    

    [HttpPost]
    public async Task<IActionResult> CreateItem([FromBody] GameDto? dto)
    {
        if (dto == null) return BadRequest();

        GameDto result = await _gameService.CreateGameAsync(dto);

        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateGame([FromBody] GameDto? dto)
    {
        if (dto == null) return BadRequest();

        GameDto result = await _gameService.UpdateGameAsync(dto);
        
        return Ok(result);
    }

    [HttpPost("AddUserGame")]
    public async Task<IActionResult> AddUserGame([FromBody] GameDto? dto)
    {
        if (dto == null) return BadRequest();

        Guid? userId = GetUserId();
        if (userId == null) return Unauthorized();
        
        try
        {
            await _gameService.AddUserGameAsync(userId.Value, dto);
            return Ok(dto);
        }
        catch (InvalidOperationException)
        {
            return Conflict("User already has this game.");
        }

    }

    [HttpGet("UserGames")]
    public async Task<IActionResult> GetUserGamesByUserId()
    {
        Guid? userId = GetUserId();
        if (userId == null) return Unauthorized();
        
        List<GameDto>? dtoList = await _gameService.GetUserGamesAsync(userId.Value);

        return Ok(dtoList);
    }
    
    
    [HttpDelete("RemoveUserGame/{gameId:guid}")]
    public async Task<IActionResult> RemoveUserGame(Guid gameId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        
        try
        {
            await _gameService.RemoveUserGameAsync(userId.Value, gameId);
            return Ok();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("GroupGames/{groupId:guid}")]
    public async Task<IActionResult> GetGroupGames(Guid groupId)
    {
        List<GameDto>? dtoList = await _gameService.GetGroupGamesAsync(groupId);

        return Ok(dtoList);
    }
}