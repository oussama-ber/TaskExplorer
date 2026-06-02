using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Application.Tasks.Queries.GetTasksByGoal;

namespace TaskExplorer.Application.Tasks.Queries.GetAllTasks;

public record GetAllTasksQuery : IRequest<List<TaskDto>>;

public class GetAllTasksQueryHandler : IRequestHandler<GetAllTasksQuery, List<TaskDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllTasksQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskDto>> Handle(GetAllTasksQuery request, CancellationToken cancellationToken)
    {
        return await _context.Tasks
            .Where(t => !t.Completed)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Completed = t.Completed,
                CompletedAt = t.CompletedAt,
                Priority = t.Priority.ToString(),
                DueDate = t.DueDate,
                StartTime = t.StartTime,
                EndTime = t.EndTime,
                Category = t.Category,
                GoalId = t.GoalId
            })
            .ToListAsync(cancellationToken);
    }
}
