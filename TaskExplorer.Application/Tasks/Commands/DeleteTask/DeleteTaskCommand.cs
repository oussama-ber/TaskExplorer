using MediatR;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Tasks.Commands.DeleteTask;

public record DeleteTaskCommand(Guid Id) : IRequest;

public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Task {request.Id} not found");
        }

        _context.Tasks.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
