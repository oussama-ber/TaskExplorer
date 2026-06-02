namespace TaskExplorer.Application.Users.Queries.GetCurrentUser;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool OnboardingCompleted { get; set; }
    public AvailabilityDto? Availability { get; set; }
}

public class AvailabilityDto
{
    public string SleepStart { get; set; } = string.Empty;
    public string SleepEnd { get; set; } = string.Empty;
    public int Age { get; set; }
    public int BreakTimeMinutes { get; set; }
}
