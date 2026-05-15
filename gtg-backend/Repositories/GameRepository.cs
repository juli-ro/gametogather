using gtg_backend.Data;
using gtg_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gtg_backend.Repositories;

public interface IGameRepository
{
    Task<List<Game>> GetAllAsync();
    Task<Game?> GetByIdAsync(Guid id);
    Task AddAsync(Game game);

    void Update(Game game);

    //
    Task<bool> UserGameExistsAsync(Guid userId, Guid gameId);
    Task AddUserGameAsync(UserGame userGame);
    Task<UserGame?> GetUserGameIncludingDeletedAsync(Guid userId, Guid gameId);

    void UpdateUserGame(UserGame userGame);

    Task<List<Game>> GetUserGamesAsync(Guid userId);
    Task<UserGame?> GetUserGameAsync(Guid userId, Guid gameId);
    void RemoveUserGame(UserGame userGame);
    
    Task<List<Game>> GetGroupGamesAsync(Guid groupId);
    
    Task SaveChangesAsync();
}

public class GameRepository : IGameRepository
{
    private readonly GameDbContext _context;

    public GameRepository(GameDbContext context)
    {
        _context = context;
    }

    public async Task<List<Game>> GetAllAsync()
    {
        return await _context.Games.ToListAsync();
    }

    public async Task<Game?> GetByIdAsync(Guid id)
    {
        return await _context.Games.AsNoTracking().FirstOrDefaultAsync(game => game.Id == id);
    }

    public async Task AddAsync(Game game)
    {
        await _context.Games.AddAsync(game);
    }

    public void Update(Game game)
    {
        _context.Games.Update(game);
    }

    public async Task<bool> UserGameExistsAsync(Guid userId, Guid gameId)
    {
        return await _context.UserGames.AnyAsync(x => x.GameId == gameId && x.UserId == userId);
    }

    public async Task AddUserGameAsync(UserGame userGame)
    {
        await _context.UserGames.AddAsync(userGame);
    }

    public async Task<UserGame?> GetUserGameIncludingDeletedAsync(Guid userId, Guid gameId)
    {
        return await _context.UserGames
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GameId == gameId);
    }

    public void UpdateUserGame(UserGame userGame)
    {
        _context.UserGames.Update(userGame);
    }

    public async Task<List<Game>> GetUserGamesAsync(Guid userId)
    {
        return await _context.UserGames
            .AsNoTracking()
            .Where(ug => ug.UserId == userId)
            .Select(x => x.Game)
            .ToListAsync();
    }

    public async Task<UserGame?> GetUserGameAsync(Guid userId, Guid gameId)
    {
        return await _context.UserGames.FirstOrDefaultAsync(ug => ug.GameId == gameId && ug.UserId == userId);
    }

    public void RemoveUserGame(UserGame userGame)
    {
        _context.UserGames.Remove(userGame);
    }

    public async Task<List<Game>> GetGroupGamesAsync(Guid groupId)
    {
        return await _context.GroupUsers
            .Where(gu => gu.GroupId == groupId)
            .SelectMany(gu => gu.User!.UserGames)
            .Select(ug => ug.Game)
            .Distinct()
            .AsNoTracking()
            .ToListAsync();    
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}