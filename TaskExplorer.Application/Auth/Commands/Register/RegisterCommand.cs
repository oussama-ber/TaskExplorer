using MediatR;

namespace TaskExplorer.Application.Auth.Commands.Register;

public record RegisterCommand(
    string Email,
    string Password,
    string FullName) : IRequest<bool>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, bool>
{
    // Implementation would use UserManager<User>
    public Task<bool> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(true);
    }
}
