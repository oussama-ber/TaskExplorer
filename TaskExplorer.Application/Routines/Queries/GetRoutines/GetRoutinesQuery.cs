using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskExplorer.Application.Common.Interfaces;

namespace TaskExplorer.Application.Routines.Queries.GetRoutines;

public record GetRoutinesQuery : IRequest<List<RoutineDto>>;

public class GetRoutinesQueryHandler : IRequestHandler<GetRoutinesQuery, List<RoutineDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRoutinesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoutineDto>> Handle(GetRoutinesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var routines = await _context.Routines
                .Select(r => new RoutineDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    Icon = r.Icon,
                    Days = r.Days,
                    IsActive = r.IsActive
                })
                .ToListAsync(cancellationToken);
            return routines;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}

public class RoutineDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Icon { get; set; } = "🔄";
    public List<string> Days { get; set; } = new();
    public bool IsActive { get; set; }
}
