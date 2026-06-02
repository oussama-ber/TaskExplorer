using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskExplorer.Application.Dashboard.Queries.GetDashboardStats;

namespace TaskExplorer.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var stats = await _mediator.Send(new GetDashboardStatsQuery(userId));
        return Ok(stats);
    }
}
