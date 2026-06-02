using MediatR;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Goals.Commands.UpdateGoal;

public record UpdateGoalCommand(
    Guid Id,
    string Title,
    string? Description,
    string Icon,
    string? Category,
    List<string> Tags,
    bool IsCompleted) : IRequest;

public class UpdateGoalCommandHandler : IRequestHandler<UpdateGoalCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateGoalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateGoalCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Goals.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Goal {request.Id} not found");
        }

        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.Icon = request.Icon;
        entity.Category = request.Category;
        entity.Tags = request.Tags;
        entity.IsCompleted = request.IsCompleted;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
