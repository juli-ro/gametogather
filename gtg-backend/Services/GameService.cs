using AutoMapper;
using gtg_backend.Dtos;
using gtg_backend.Models;
using gtg_backend.Repositories;

namespace gtg_backend.Services;

public interface IGameService
{
    Task<List<GameDto>> GetAllGamesAsync();
    Task<GameDto?> GetGameByIdAsync(Guid id);
    Task<GameDto> CreateGameAsync(GameDto dto);
    Task<GameDto> UpdateGameAsync(GameDto dto);
    Task AddUserGameAsync(Guid userId, GameDto dto);
    Task<List<GameDto>> GetUserGamesAsync(Guid userId);
    Task RemoveUserGameAsync(Guid userId, Guid gameId);
    Task<List<GameDto>> GetGroupGamesAsync(Guid groupId);
}

public class GameService : IGameService
{
    private readonly IGameRepository _repository;
    private readonly IMapper _mapper;

    public GameService(IGameRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<GameDto>> GetAllGamesAsync()
    {
        List<Game> games = await _repository.GetAllAsync();
        return _mapper.Map<List<GameDto>>(games);
    }

    public async Task<GameDto?> GetGameByIdAsync(Guid id)
    {
        Game? game = await _repository.GetByIdAsync(id);
        return game == null ? null : _mapper.Map<GameDto>(game);
    }

    public async Task<GameDto> CreateGameAsync(GameDto dto)
    {
        Game? item = _mapper.Map<Game>(dto);
        item.Id = Guid.NewGuid();

        await _repository.AddAsync(item);
        await _repository.SaveChangesAsync();

        return _mapper.Map<GameDto>(item);
    }

    public async Task<GameDto> UpdateGameAsync(GameDto dto)
    {
        Game? game = _mapper.Map<Game>(dto);
        _repository.Update(game);
        await _repository.SaveChangesAsync();

        return _mapper.Map<GameDto>(game);
    }

    public async Task AddUserGameAsync(Guid userId, GameDto dto)
    {
        UserGame? existingLink = await _repository.GetUserGameIncludingDeletedAsync(userId, dto.Id);

        if (existingLink != null)
        {
            if (existingLink.IsDeleted)
            {
                existingLink.IsDeleted = false;
                _repository.UpdateUserGame(existingLink);
                await _repository.SaveChangesAsync();
                return;
            }
            else
            {
                throw new InvalidOperationException("Game already exists");
            }
        }

        var newUserGame = new UserGame { UserId = userId, GameId = dto.Id };
        await _repository.AddUserGameAsync(newUserGame);
        await _repository.SaveChangesAsync();
    }

    public async Task<List<GameDto>> GetUserGamesAsync(Guid userId)
    {
        var gameList = await _repository.GetUserGamesAsync(userId);
        return _mapper.Map<List<GameDto>>(gameList);
    }

    public async Task RemoveUserGameAsync(Guid userId, Guid gameId)
    {
        var entryToDelete = await _repository.GetUserGameAsync(userId, gameId);
        if (entryToDelete == null)
        {
            throw new KeyNotFoundException("UserGame not found.");
        }

        _repository.RemoveUserGame(entryToDelete);
        await _repository.SaveChangesAsync();
    }

    public async Task<List<GameDto>> GetGroupGamesAsync(Guid groupId)
    {
        var games = await _repository.GetGroupGamesAsync(groupId);
        return _mapper.Map<List<GameDto>>(games);
    }
}