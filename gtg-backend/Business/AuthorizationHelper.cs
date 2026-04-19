using System.Security.Cryptography;
using System.Text;

namespace gtg_backend.Business;

//Todo: create a service with DI later
public static class AuthorizationHelper
{
    
    public static string HashPassword(string password, string salt)
    {
        using SHA512 sha = SHA512.Create();
        byte[] passwordBytes = Encoding.UTF8.GetBytes(password + salt);
            
        byte[] hashBytes = sha.ComputeHash(passwordBytes);
        
        return Convert.ToHexStringLower(hashBytes);
    }

    public static string CreateSalt(int saltByteLength)
    {
        var newSaltByte = RandomNumberGenerator.GetBytes(saltByteLength);
        var newSaltString = Convert.ToHexString(newSaltByte);
        
        return newSaltString;
    }
    
}