using MediatR;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Tasks.Commands;

public record CreateTaskCommand(
    string Title,
    string? Description,
    TaskPriority Priority,
    DateTime? DueDate,
    Guid GoalId) : IRequest<Guid>;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Guid>
{
    public Task<Guid> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Guid.NewGuid());
    }
}
