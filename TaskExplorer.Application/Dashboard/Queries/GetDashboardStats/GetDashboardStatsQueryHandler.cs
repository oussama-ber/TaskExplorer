using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Dashboard.Queries.GetDashboardStats;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var startOfDay = now.Date;
        var startOfWeek = now.Date.AddDays(-(int)now.DayOfWeek);
        var startOfMonth = new DateTime(now.Year, now.Month, 1);

        // Get all tasks for the user
        var allTasks = await _context.Tasks
            .Include(t => t.Goal)
            .Where(t => t.Goal.UserId == request.UserId)
            .ToListAsync(cancellationToken);

        var totalTasks = allTasks.Count;
        var completedTasks = allTasks.Count(t => t.Completed);
        var pendingTasks = totalTasks - completedTasks;

        // Calculate time-based counts (tasks created in period)
        var dailyTasks = allTasks.Count(t => t.Goal.CreatedAt >= startOfDay);
        var weeklyTasks = allTasks.Count(t => t.Goal.CreatedAt >= startOfWeek);
        var monthlyTasks = allTasks.Count(t => t.Goal.CreatedAt >= startOfMonth);

        // Calculate completion percentage
        var completionPercentage = totalTasks > 0 ? (decimal)completedTasks / totalTasks * 100 : 0;

        // Weekly activity data (last 7 days)
        var weeklyActivity = new List<WeeklyActivityDto>();
        for (int i = 6; i >= 0; i--)
        {
            var day = now.Date.AddDays(-i);
            var dayName = day.ToString("ddd");
            
            var completedOnDay = allTasks.Count(t => t.Completed && t.Goal.CreatedAt.Date == day);
            var addedOnDay = allTasks.Count(t => t.Goal.CreatedAt.Date == day);

            weeklyActivity.Add(new WeeklyActivityDto
            {
                Name = dayName,
                Completed = completedOnDay,
                Added = addedOnDay
            });
        }

        // Work capacity (simplified - based on task priorities)
        var highPriorityCount = allTasks.Count(t => !t.Completed && t.Priority == Domain.Entities.TaskPriority.HIGH);
        var mediumPriorityCount = allTasks.Count(t => !t.Completed && t.Priority == Domain.Entities.TaskPriority.MEDIUM);
        var lowPriorityCount = allTasks.Count(t => !t.Completed && t.Priority == Domain.Entities.TaskPriority.LOW);

        var workCapacity = new List<WorkCapacityDto>
        {
            new() { Name = "High Priority", Value = highPriorityCount, Color = "#F97316" },
            new() { Name = "Medium Priority", Value = mediumPriorityCount, Color = "#2F5FED" },
            new() { Name = "Low Priority", Value = lowPriorityCount, Color = "#10B981" }
        };

        // Current goal progress (most recent active goal)
        var activeGoal = await _context.Goals
            .Include(g => g.Tasks)
            .Where(g => g.UserId == request.UserId && !g.IsCompleted)
            .OrderByDescending(g => g.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        GoalProgressDto? goalProgress = null;
        if (activeGoal != null)
        {
            var goalTotalTasks = activeGoal.Tasks.Count;
            var goalCompletedTasks = activeGoal.Tasks.Count(t => t.Completed);
            var goalPercentage = goalTotalTasks > 0 ? (decimal)goalCompletedTasks / goalTotalTasks * 100 : 0;

            goalProgress = new GoalProgressDto
            {
                GoalTitle = activeGoal.Title,
                CompletedTasks = goalCompletedTasks,
                TotalTasks = goalTotalTasks,
                Percentage = Math.Round(goalPercentage, 0)
            };
        }

        return new DashboardStatsDto
        {
            DailyTaskCount = dailyTasks,
            WeeklyTaskCount = weeklyTasks,
            MonthlyTaskCount = monthlyTasks,
            TotalTasks = totalTasks,
            CompletedTasks = completedTasks,
            PendingTasks = pendingTasks,
            CompletionPercentage = Math.Round(completionPercentage, 1),
            WeeklyActivity = weeklyActivity,
            WorkCapacity = workCapacity,
            CurrentGoalProgress = goalProgress
        };
    }
}
