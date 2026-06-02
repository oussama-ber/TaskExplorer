using Microsoft.AspNetCore.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskExplorer.Application.Habits.Queries.GetHabitScore;

namespace TaskExplorer.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HabitsController : ControllerBase
{
    private readonly IMediator _mediator;

    public HabitsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("score")]
    public async Task<ActionResult<HabitScoreDto>> GetScore()
    {
        var result = await _mediator.Send(new GetHabitScoreQuery());
        return Ok(result);
    }
}
