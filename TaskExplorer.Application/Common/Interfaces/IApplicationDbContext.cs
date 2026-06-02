using Microsoft.EntityFrameworkCore;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Goal> Goals { get; }
    DbSet<TaskItem> Tasks { get; }
    DbSet<Routine> Routines { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
