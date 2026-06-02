using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Tasks.Queries.GetTasksByGoal;

public record GetTasksByGoalQuery(Guid GoalId) : IRequest<List<TaskDto>>;

public class GetTasksByGoalQueryHandler : IRequestHandler<GetTasksByGoalQuery, List<TaskDto>>
{
    private readonly IApplicationDbContext _context;

    public GetTasksByGoalQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskDto>> Handle(GetTasksByGoalQuery request, CancellationToken cancellationToken)
    {
        return await _context.Tasks
            .Where(t => t.GoalId == request.GoalId)
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

public class TaskDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Completed { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Priority { get; set; } = "MEDIUM";
    public DateTime? DueDate { get; set; }
    public string? StartTime { get; set; }
    public string? EndTime { get; set; }
    public string Category { get; set; } = "General";
    public Guid GoalId { get; set; }
}
