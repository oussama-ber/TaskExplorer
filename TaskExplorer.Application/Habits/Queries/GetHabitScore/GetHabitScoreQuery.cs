using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Habits.Queries.GetHabitScore;

public record GetHabitScoreQuery : IRequest<HabitScoreDto>;

public class GetHabitScoreQueryHandler : IRequestHandler<GetHabitScoreQuery, HabitScoreDto>
{
    private readonly IApplicationDbContext _context;

    public GetHabitScoreQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<HabitScoreDto> Handle(GetHabitScoreQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var lookback14 = today.AddDays(-13); // 14 days window
        var lookback7 = today.AddDays(-6);   // 7 days for weekly heatmap

        var allTasks = await _context.Tasks
            .Include(t => t.Goal)
            .ToListAsync(cancellationToken);

        var completedTasks = allTasks.Where(t => t.Completed).ToList();
        var totalCount = allTasks.Count;
        var completedCount = completedTasks.Count;

        // ── Consistency score (40 pts) ───────────────────────────────────────
        // Days in last 14 with at least 1 completed task
        var activeDays = completedTasks
            .Where(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date >= lookback14)
            .Select(t => t.CompletedAt!.Value.Date)
            .Distinct()
            .Count();
        var consistencyScore = (double)activeDays / 14.0 * 40.0;

        // ── Completion rate (30 pts) ─────────────────────────────────────────
        var completionScore = totalCount > 0 ? (double)completedCount / totalCount * 30.0 : 30.0;

        // ── Priority discipline (20 pts) ─────────────────────────────────────
        var highTasks = allTasks.Where(t => t.Priority == Domain.Entities.TaskPriority.HIGH).ToList();
        var completedHighTasks = highTasks.Count(t => t.Completed);
        var priorityScore = highTasks.Count > 0
            ? (double)completedHighTasks / highTasks.Count * 20.0
            : 20.0; // full marks if no HIGH tasks exist

        // ── Goal progress (10 pts) ───────────────────────────────────────────
        var goals = allTasks.GroupBy(t => t.GoalId).ToList();
        double goalScore = 10.0;
        if (goals.Any())
        {
            var avgCompletion = goals
                .Select(g =>
                {
                    var total = g.Count();
                    var done = g.Count(t => t.Completed);
                    return total > 0 ? (double)done / total : 0.0;
                })
                .Average();
            goalScore = avgCompletion * 10.0;
        }

        var totalScore = (int)Math.Round(consistencyScore + completionScore + priorityScore + goalScore);

        // ── Current streak ───────────────────────────────────────────────────
        var completedDates = completedTasks
            .Where(t => t.CompletedAt.HasValue)
            .Select(t => t.CompletedAt!.Value.Date)
            .Distinct()
            .OrderByDescending(d => d)
            .ToList();

        int streak = 0;
        var checkDate = today;
        foreach (var date in completedDates)
        {
            if (date == checkDate || date == checkDate.AddDays(-1))
            {
                streak++;
                checkDate = date;
            }
            else
            {
                break;
            }
        }

        // ── Weekly activity (last 7 days) ────────────────────────────────────
        var weeklyActivity = Enumerable.Range(0, 7)
            .Select(i =>
            {
                var day = today.AddDays(-6 + i);
                var count = completedTasks.Count(t =>
                    t.CompletedAt.HasValue && t.CompletedAt.Value.Date == day);
                return new DayActivity
                {
                    Date = day.ToString("yyyy-MM-dd"),
                    DayLabel = day.ToString("ddd"),
                    Count = count
                };
            })
            .ToList();

        // ── Good habits (goals with ≥60% completion, min 2 tasks) ────────────
        var goalGroups = allTasks
            .GroupBy(t => new { t.GoalId, t.Goal.Title })
            .Where(g => g.Count() >= 2)
            .ToList();

        var goodHabits = goalGroups
            .Where(g => (double)g.Count(t => t.Completed) / g.Count() >= 0.6)
            .Select(g => new HabitItem
            {
                GoalTitle = g.Key.Title,
                CompletedCount = g.Count(t => t.Completed),
                TotalCount = g.Count(),
                Percentage = (int)Math.Round((double)g.Count(t => t.Completed) / g.Count() * 100)
            })
            .OrderByDescending(h => h.Percentage)
            .Take(5)
            .ToList();

        // ── Bad habits: goals with overdue HIGH priority incomplete tasks ─────
        var overdueHighTasks = allTasks
            .Where(t => !t.Completed
                && t.Priority == Domain.Entities.TaskPriority.HIGH
                && t.DueDate.HasValue
                && t.DueDate.Value.Date < today)
            .GroupBy(t => new { t.GoalId, t.Goal.Title })
            .Select(g => new HabitItem
            {
                GoalTitle = g.Key.Title,
                CompletedCount = 0,
                TotalCount = g.Count(),
                Percentage = 0
            })
            .Take(5)
            .ToList();

        return new HabitScoreDto
        {
            Score = totalScore,
            Streak = streak,
            ConsistencyScore = (int)Math.Round(consistencyScore),
            CompletionScore = (int)Math.Round(completionScore),
            PriorityScore = (int)Math.Round(priorityScore),
            GoalScore = (int)Math.Round(goalScore),
            ActiveDaysLast14 = activeDays,
            WeeklyActivity = weeklyActivity,
            GoodHabits = goodHabits,
            BadHabits = overdueHighTasks,
            TotalTasksCompleted = completedCount,
            TotalTasks = totalCount,
        };
    }
}

public class HabitScoreDto
{
    public int Score { get; set; }
    public int Streak { get; set; }
    public int ConsistencyScore { get; set; }
    public int CompletionScore { get; set; }
    public int PriorityScore { get; set; }
    public int GoalScore { get; set; }
    public int ActiveDaysLast14 { get; set; }
    public int TotalTasksCompleted { get; set; }
    public int TotalTasks { get; set; }
    public List<DayActivity> WeeklyActivity { get; set; } = new();
    public List<HabitItem> GoodHabits { get; set; } = new();
    public List<HabitItem> BadHabits { get; set; } = new();
}

public class DayActivity
{
    public string Date { get; set; } = string.Empty;
    public string DayLabel { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class HabitItem
{
    public string GoalTitle { get; set; } = string.Empty;
    public int CompletedCount { get; set; }
    public int TotalCount { get; set; }
    public int Percentage { get; set; }
}
