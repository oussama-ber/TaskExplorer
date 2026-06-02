using Microsoft.AspNetCore.Identity;

namespace TaskExplorer.Domain.Entities;

public class User : IdentityUser
{
    public string? AvatarUrl { get; set; }
    public bool OnboardingCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Virtual collections for EF lazy loading if needed
    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}
