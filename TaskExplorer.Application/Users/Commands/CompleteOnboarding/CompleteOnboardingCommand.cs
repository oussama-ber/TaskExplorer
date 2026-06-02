using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Users.Commands.CompleteOnboarding;

public record CompleteOnboardingCommand(string UserId) : IRequest<bool>;

public class CompleteOnboardingCommandHandler : IRequestHandler<CompleteOnboardingCommand, bool>
{
    private readonly UserManager<User> _userManager;

    public CompleteOnboardingCommandHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> Handle(CompleteOnboardingCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null) return false;

        user.OnboardingCompleted = true;
        var result = await _userManager.UpdateAsync(user);

        return result.Succeeded;
    }
}
