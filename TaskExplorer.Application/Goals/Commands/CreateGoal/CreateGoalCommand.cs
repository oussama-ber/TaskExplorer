using MediatR;
using TaskExplorer.Domain.Entities;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Goals.Commands.CreateGoal;

public record CreateGoalCommand(
    string Title,
    string? Description,
    string Icon,
    string? Category,
    List<string> Tags,
    string UserId = "") : IRequest<Guid>;

public class CreateGoalCommandHandler : IRequestHandler<CreateGoalCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateGoalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateGoalCommand request, CancellationToken cancellationToken)
    {
        var entity = new Goal
        {
            Title = request.Title,
            Description = request.Description,
            Icon = request.Icon,
            Category = request.Category,
            Tags = request.Tags,
            UserId = request.UserId
        };

        _context.Goals.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
