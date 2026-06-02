using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using TaskExplorer.Application.Goals.Commands.CreateGoal;
using TaskExplorer.Application.Goals.Commands.UpdateGoal;
using TaskExplorer.Application.Goals.Commands.DeleteGoal;
using TaskExplorer.Application.Goals.Queries.GetGoals;

namespace TaskExplorer.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    private readonly IMediator _mediator;

    public GoalsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<GoalDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetGoalsQuery()));
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateGoalCommand command)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var updatedCommand = command with { UserId = userId };
        var goalId = await _mediator.Send(updatedCommand);
        return CreatedAtAction(nameof(Create), new { id = goalId }, goalId);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, UpdateGoalCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteGoalCommand(id));
        return NoContent();
    }
}
