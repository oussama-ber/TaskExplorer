using MediatR;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Tasks.Commands.CreateTask;

public record CreateTaskCommand(
    string Title,
    string? Description,
    string Priority,
    DateTime? DueDate,
    string? StartTime,
    string? EndTime,
    Guid GoalId) : IRequest<Guid>;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = Enum.Parse<TaskPriority>(request.Priority, true),
            DueDate = request.DueDate,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            GoalId = request.GoalId
        };

        _context.Tasks.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
