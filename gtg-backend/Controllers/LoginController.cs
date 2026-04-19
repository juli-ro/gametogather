using System.IdentityModel.Tokens.Jwt;
using System.Runtime.Intrinsics.Arm;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using gtg_backend.Business;
using gtg_backend.Data;
using gtg_backend.Dtos;
using gtg_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace gtg_backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class LoginController: ControllerBase
{
    const int ToxenExpirationTime = 30;
    
    private IConfiguration _config;
    private GameDbContext _context;

    public LoginController(GameDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {

        User? user = await AuthenticateUser(loginDto);

        if (user != null)
        {
            string tokenString = GenerateJsonWebToken(user);
            return Ok(new { token = tokenString});
        }

        return Unauthorized();

    }

    // private string HashPassword(string password, string salt)
    // {
    //     using SHA512 sha = SHA512.Create();
    //     byte[] passwordBytes = Encoding.UTF8.GetBytes(password + salt);
    //         
    //     byte[] hashBytes = sha.ComputeHash(passwordBytes);
    //     
    //     return Convert.ToHexStringLower(hashBytes);
    // }
    

    private string GenerateJsonWebToken(User user)
    {
        SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        if (user.Role is not null)
        {
            claims.Add(new Claim(ClaimTypes.Role, user.Role.Name));
        }

        JwtSecurityToken token = new JwtSecurityToken("https://gametogather.de",
            "https://gametogather.de",
            claims,
            expires: DateTime.Now.AddMinutes(ToxenExpirationTime),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    private async Task<User?> AuthenticateUser(LoginDto loginDto)
    {
       User? user = await _context.Users
           .Include(user => user.Role)
           .Where(x => x.Name == loginDto.Name)
           .FirstOrDefaultAsync();

       if (user == null)
       {
           return null;
       }
       
       string hashedPassword = AuthorizationHelper.HashPassword(loginDto.Password, user.Salt);

       if (hashedPassword == user.Password)
       {
           return user;
       }

       return null;
       
    }

}
