using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Users.Queries.GetCurrentUser;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserDto?>
{
    private readonly UserManager<User> _userManager;
    

    public GetCurrentUserQueryHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<UserDto?> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.Users
            .Where(u => u.Id == request.UserId)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.UserName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                AvatarUrl = null, // Can be added to User entity later
                OnboardingCompleted = u.OnboardingCompleted,
                Availability = null // Can be added to User entity later
            })
            .FirstOrDefaultAsync(cancellationToken);

        return user;
    }
}
