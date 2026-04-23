using gtg_backend.Data;
using gtg_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gtg_backend.Business;

public static class Seeder
{
    public static async Task SeedApplication(GameDbContext context)
    {
        Guid baseRoleId = Guid.Parse("d17a1ef3-a983-4d29-bd69-8026925101eb");
        Guid baseUserId = Guid.Parse("3e45589d-e653-49eb-add7-78f6c33bb644");
        
        if (!await context.Roles.AnyAsync(r => r.Name == "baseUser"))
        {
            context.Roles.Add(new Role
            {
                Name = "baseUser",
                Id = baseRoleId
            });
            await context.SaveChangesAsync();
        }
        
        if (!await context.Users.AnyAsync(u => u.Name == "baseUser"))
        {
            context.Users.Add(new User
            {
                Name = "baseUser",
                Email = "user@user.com",
                Password = "253fbeb9c62e6602333cbe4be8d8c90f402fedb6dd93184c84f3de94b8b01ea98dd48f69db13cad6ca096bddd67f06d63d8b0c8c1df9674642b532a21435cd05",
                Salt = "2527451FCB949AB86DFD7C41C012DFF6",
                RoleId = baseRoleId,
                Id = baseUserId
            });
            await context.SaveChangesAsync();
        }
    }
}