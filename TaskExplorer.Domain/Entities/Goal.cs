namespace TaskExplorer.Domain.Entities;

public class Goal
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Icon { get; set; } = "🎯";
    public string? Category { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = string.Empty;
    public virtual User User { get; set; } = null!;
    
    public virtual ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
