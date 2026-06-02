using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Domain.Entities;
using TaskExplorer.Infrastructure.Persistence;

namespace TaskExplorer.API.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Check if temp user already exists
        var tempUser = await userManager.FindByIdAsync("temp-user-1");
        if (tempUser == null)
        {
            tempUser = new User
            {
                Id = "temp-user-1",
                UserName = "demo@taskexplorer.com",
                Email = "demo@taskexplorer.com",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(tempUser, "Demo@123");
            if (result.Succeeded)
            {
                Console.WriteLine("Temporary user created successfully!");
            }
        }
    }
}
