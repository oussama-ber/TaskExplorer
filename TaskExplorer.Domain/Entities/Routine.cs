namespace TaskExplorer.Domain.Entities;

public class Routine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Icon { get; set; } = "🔄";
    public string? Category { get; set; }
    public List<string> Days { get; set; } = new(); // Monday, Tuesday, etc.
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = string.Empty;
    public virtual User User { get; set; } = null!;
}
