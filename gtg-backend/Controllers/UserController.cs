using System.Security.Claims;
using AutoMapper;
using gtg_backend.Business;
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
public class UserController : BaseController<User,UserDto>
{
    private const int StandardSaltByteSize = 32;
    private const int InitialPasswordSaltByteSize = 8;
    private const string BaseUserRoleName = "baseUser";
    
    public UserController(GameDbContext context, IMapper mapper) : base(context, mapper, context.Users)
    {
        
    }

    [HttpGet]
    public override async Task<IActionResult> GetAll()
    {
        List<User>? itemList = await _context.Users
            .Include(user => user.Games)
            .Include(user => user.Role)
            .ToListAsync();
        List<UserDto>? dtoList = _mapper.Map<List<UserDto>>(itemList);
        
        return Ok(dtoList);
    }

    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(Guid id)
    {
        User? item = await _dbSet
            .Include(user => user.Games)
            .Include(user => user.Role)
            .FirstOrDefaultAsync(user => user.Id == id);
        if (item == null)
        {
            return NotFound();
        }
        UserDto? itemDto = _mapper.Map<UserDto>(item);
        return Ok(itemDto);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("adminUser")]
    public async Task<IActionResult> GetAllAdminUsers()
    {
        List<User>? itemList = await _context.Users
            .Include(user => user.Role)
            .ToListAsync();
        
        return Ok(itemList);
    }
    
    [Authorize(Roles = "admin")]
    [HttpGet("adminUser/{id}")]
    public async Task<IActionResult> GetAdminUserById(Guid id)
    {
        User? item = await _dbSet.Include(user => user.Role)
            .FirstOrDefaultAsync(user => user.Id == id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }
    

    //Todo: Create UserEditDto
    [Authorize(Roles = "admin")]
    [HttpPost("adminUser")]
    public async Task<IActionResult> CreateAdminUser([FromBody] FullUserDto? user)
    {
        if (user == null)
        {
            return BadRequest("User is null");
        }
        
        User newUser = new User
        {
            Name = user.Name,
            Email = user.Email,
            Password = "",
            Salt = ""
        };
        
        
        
        var newSaltString = AuthorizationHelper.CreateSalt(StandardSaltByteSize);
        
        newUser.Salt = newSaltString;

        string newPassword = AuthorizationHelper.CreateSalt(InitialPasswordSaltByteSize);
        string passwordHash = AuthorizationHelper.HashPassword(newPassword, newSaltString);
        newUser.Password = passwordHash;
        newUser.Role = await _context.Roles.FirstOrDefaultAsync(role => role.Name == BaseUserRoleName);

        if (newUser.Role == null)
        {
            return BadRequest("Invalid role");
        }
        
        _context.Users.Add(newUser);
        
        await _context.SaveChangesAsync();
        
        return Ok(new MessageDto{Message = newPassword}); 
    }
    
    [HttpPost]
    public override async Task<IActionResult> CreateItem([FromBody]UserDto? dto)
    {
        return BadRequest();
    }
    
    [Authorize(Roles = "admin")]
    [HttpPut("adminUser")]
    public  async Task<IActionResult> UpdateAdminUser([FromBody]FullUserDto? dto)
    {
        if (dto == null)
        {
            return BadRequest();
        }
        User? item = await _context.Users.FirstOrDefaultAsync(user => user.Id == dto.Id);

        if (item == null)
        {
            return NotFound();
        }
        
        item.Name = dto.Name;
        item.Email = dto.Email;

        _context.Users.Update(item);
        await _context.SaveChangesAsync();
        
        
        return Ok(dto);
    }

    [HttpPut]
    public override async Task<IActionResult> UpdateItem([FromBody] UserDto? dto)
    {
        return BadRequest();
    }

    [HttpPost("changePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto? dto)
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
        
        Guid userGuid = Guid.Parse(userId);
        User? user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);

        if (user == null)
        {
            return NotFound();
        }
        
        var oldPasswordHash = AuthorizationHelper.HashPassword(dto.OldPassword, user.Salt);

        if (user.Password != oldPasswordHash)
        {
            return Unauthorized();
        }
        
        var newSalt = AuthorizationHelper.CreateSalt(StandardSaltByteSize);
        var newHash = AuthorizationHelper.HashPassword(dto.NewPassword, newSalt);
        
        user.Salt = newSalt;
        user.Password = newHash;
        
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        
        return Ok();
    }

    
}