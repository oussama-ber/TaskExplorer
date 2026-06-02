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
        var startOfToday = now.Date;
        var startOfYesterday = now.Date.AddDays(-1);
        var startOfWeek = now.Date.AddDays(-(int)now.DayOfWeek);
        var startOfLastWeek = startOfWeek.AddDays(-7);
        var startOfMonth = new DateTime(now.Year, now.Month, 1);
        var startOfLastMonth = startOfMonth.AddMonths(-1);

        // Get all tasks for the user
        var allTasks = await _context.Tasks
            .Include(t => t.Goal)
            .Where(t => t.Goal.UserId == request.UserId)
            .ToListAsync(cancellationToken);

        var totalTasks = allTasks.Count;
        var completedTasks = allTasks.Count(t => t.Completed);
        var pendingTasks = totalTasks - completedTasks;

        // Daily: tasks completed today vs yesterday
        var dailyCount = allTasks.Count(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date == startOfToday);
        var yesterdayCount = allTasks.Count(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date == startOfYesterday);
        var dailyTrend = dailyCount - yesterdayCount;

        // Weekly: tasks completed this week vs last week
        var weeklyCount = allTasks.Count(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date >= startOfWeek);
        var lastWeekCount = allTasks.Count(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date >= startOfLastWeek && t.CompletedAt.Value.Date < startOfWeek);
        var weeklyTrend = weeklyCount - lastWeekCount;

        // Monthly: tasks completed this month vs last month
        var monthlyCount = allTasks.Count(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date >= startOfMonth);
        var lastMonthCount = allTasks.Count(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date >= startOfLastMonth && t.CompletedAt.Value.Date < startOfMonth);
        var monthlyTrend = monthlyCount - lastMonthCount;

        // Calculate completion percentage
        var completionPercentage = totalTasks > 0 ? (decimal)completedTasks / totalTasks * 100 : 0;

        // Weekly activity data (last 7 days) — tasks completed per day
        var weeklyActivity = new List<WeeklyActivityDto>();
        for (int i = 6; i >= 0; i--)
        {
            var day = now.Date.AddDays(-i);
            var dayName = day.ToString("ddd");

            var completedOnDay = allTasks.Count(t => t.CompletedAt.HasValue && t.CompletedAt.Value.Date == day);
            var addedOnDay = allTasks.Count(t => t.CreatedAt.Date == day);

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
            DailyTaskCount = dailyCount,
            WeeklyTaskCount = weeklyCount,
            MonthlyTaskCount = monthlyCount,
            TotalTasks = totalTasks,
            CompletedTasks = completedTasks,
            PendingTasks = pendingTasks,
            CompletionPercentage = Math.Round(completionPercentage, 1),
            DailyTrend = dailyTrend,
            WeeklyTrend = weeklyTrend,
            MonthlyTrend = monthlyTrend,
            WeeklyActivity = weeklyActivity,
            WorkCapacity = workCapacity,
            CurrentGoalProgress = goalProgress
        };
    }
}
