using MediatR;
using TaskExplorer.Domain.Entities;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Routines.Commands;

public record CreateRoutineCommand(
    string Title,
    string? Description,
    string Icon,
    List<string> Days,
    string UserId) : IRequest<Guid>;

public class CreateRoutineCommandHandler : IRequestHandler<CreateRoutineCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateRoutineCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateRoutineCommand request, CancellationToken cancellationToken)
    {
        var entity = new Routine
        {
            Title = request.Title,
            Description = request.Description,
            Icon = request.Icon,
            Days = request.Days,
            UserId = request.UserId
        };

        _context.Routines.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
