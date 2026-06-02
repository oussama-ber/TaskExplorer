using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Goals.Queries.GetGoals;

public record GetGoalsQuery : IRequest<List<GoalDto>>;

public class GetGoalsQueryHandler : IRequestHandler<GetGoalsQuery, List<GoalDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGoalsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<GoalDto>> Handle(GetGoalsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Goals
            .Select(g => new GoalDto
            {
                Id = g.Id,
                Title = g.Title,
                Description = g.Description,
                Icon = g.Icon,
                Category = g.Category,
                Tags = g.Tags,
                IsCompleted = g.IsCompleted,
                TotalTasks = g.Tasks.Count,
                CompletedTasks = g.Tasks.Count(t => t.Completed)
            })
            .ToListAsync(cancellationToken);
    }
}

public class GoalDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Icon { get; set; } = "🎯";
    public string? Category { get; set; }
    public string? Tag => Category;
    public List<string> Tags { get; set; } = new();
    public bool IsCompleted { get; set; }
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
}
