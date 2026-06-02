using MediatR;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Goals.Commands.DeleteGoal;

public record DeleteGoalCommand(Guid Id) : IRequest;

public class DeleteGoalCommandHandler : IRequestHandler<DeleteGoalCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteGoalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteGoalCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Goals.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Goal {request.Id} not found");
        }

        _context.Goals.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
