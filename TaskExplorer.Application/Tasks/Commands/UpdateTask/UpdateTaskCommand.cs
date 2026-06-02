using MediatR;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Tasks.Commands.UpdateTask;

public record UpdateTaskCommand(
    Guid Id,
    string Title,
    string? Description,
    bool Completed,
    string Priority,
    DateTime? DueDate,
    string? StartTime,
    string? EndTime) : IRequest;

public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Tasks.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Task {request.Id} not found");
        }

        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.Completed = request.Completed;
        entity.Priority = Enum.Parse<TaskPriority>(request.Priority, true);
        entity.DueDate = request.DueDate;
        entity.StartTime = request.StartTime;
        entity.EndTime = request.EndTime;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
