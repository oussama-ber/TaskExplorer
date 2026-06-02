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
    string? EndTime,
    string Category) : IRequest;

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
        entity.Priority = Enum.Parse<TaskPriority>(request.Priority, true);
        entity.DueDate = request.DueDate;
        entity.StartTime = request.StartTime;
        entity.EndTime = request.EndTime;
        entity.Category = string.IsNullOrWhiteSpace(request.Category) ? "General" : request.Category;

        // Track when a task is marked complete (only stamp once)
        if (request.Completed && !entity.Completed)
            entity.CompletedAt = DateTime.UtcNow;
        else if (!request.Completed)
            entity.CompletedAt = null;

        entity.Completed = request.Completed;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
