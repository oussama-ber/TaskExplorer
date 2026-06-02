using MediatR;

namespace TaskExplorer.Application.Dashboard.Queries.GetDashboardStats;

public record GetDashboardStatsQuery(string UserId) : IRequest<DashboardStatsDto>;
