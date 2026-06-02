namespace TaskExplorer.Domain.Entities;

public enum TaskPriority
{
    LOW,
    MEDIUM,
    HIGH
}

public class TaskItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Completed { get; set; }
    public TaskPriority Priority { get; set; } = TaskPriority.MEDIUM;
    public DateTime? DueDate { get; set; }
    public string? StartTime { get; set; }
    public string? EndTime { get; set; }
    public Guid GoalId { get; set; }
    public virtual Goal Goal { get; set; } = null!;
}
