using gtg_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gtg_backend.Business;

public static class Seeder
{
    public static void SeedApplication(DbContext context)
    {
        if (context.Database.EnsureCreated())
        {
            return;
        }
    
        //Todo: put into own method
        Guid baseRoleId = Guid.Parse("3e45589d-e653-49eb-add7-78f6c33bb644");
        Guid baseUserId = Guid.NewGuid();
        var baseRole = context.Set<Role>()
            .FirstOrDefault(role => role.Name == "baseUser");
        if (baseRole == null)
        {
            context.Set<Role>().AddAsync(new Role
            {
                Name = "baseUser",
                Id = baseRoleId
            });
            context.SaveChanges();
        }
    
        var baseUser = context.Set<User>()
            .FirstOrDefault(user => user.Name == "baseUser");
        if (baseUser == null)
        {
            context.Set<User>().AddAsync(new User
            {
                Name = "baseUser",
                Email = "user@user.com",
                Password =
                    "253fbeb9c62e6602333cbe4be8d8c90f402fedb6dd93184c84f3de94b8b01ea98dd48f69db13cad6ca096bddd67f06d63d8b0c8c1df9674642b532a21435cd05",
                Salt = "2527451FCB949AB86DFD7C41C012DFF6",
                RoleId = baseRoleId,
                Id = baseUserId
            });
            context.SaveChanges();
        }
    
        // var kniffel = context.Set<Game>()
        //     .FirstOrDefault(g => g.Name == "Kniffel");
        // if (kniffel == null)
        // {
        //     context.Set<Game>().AddAsync(new Game()
        //     {
        //         Id = Guid.NewGuid(),
        //         Name = "Kniffel",
        //         MaxPlayerNumber = 4,
        //         MinPlayerNumber = 1,
        //         PlayTime = 30,
        //     });
        //     context.SaveChanges();
        // }
        //
        // var maumau = context.Set<Game>()
        //     .FirstOrDefault(g => g.Name == "Mau Mau");
        // if (maumau == null)
        // {
        //     context.Set<Game>().AddAsync(new Game()
        //     {
        //         Id = Guid.NewGuid(),
        //         Name = "Mau Mau",
        //         MaxPlayerNumber = 8,
        //         MinPlayerNumber = 2,
        //         PlayTime = 10,
        //     });
        //     context.SaveChanges();
        // }
    }
}