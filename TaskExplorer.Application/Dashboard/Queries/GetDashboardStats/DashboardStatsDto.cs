namespace TaskExplorer.Application.Dashboard.Queries.GetDashboardStats;

public class DashboardStatsDto
{
    public int DailyTaskCount { get; set; }
    public int WeeklyTaskCount { get; set; }
    public int MonthlyTaskCount { get; set; }
    public int TotalTasks { get; set; }
    public decimal CompletionPercentage { get; set; }
    public int CompletedTasks { get; set; }
    public int PendingTasks { get; set; }
    
    public List<WeeklyActivityDto> WeeklyActivity { get; set; } = new();
    public List<WorkCapacityDto> WorkCapacity { get; set; } = new();
    
    public GoalProgressDto? CurrentGoalProgress { get; set; }
}

public class WeeklyActivityDto
{
    public string Name { get; set; } = string.Empty;
    public int Completed { get; set; }
    public int Added { get; set; }
}

public class WorkCapacityDto
{
    public string Name { get; set; } = string.Empty;
    public int Value { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class GoalProgressDto
{
    public string GoalTitle { get; set; } = string.Empty;
    public int CompletedTasks { get; set; }
    public int TotalTasks { get; set; }
    public decimal Percentage { get; set; }
}
