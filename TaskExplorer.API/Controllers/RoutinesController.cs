using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using TaskExplorer.Application.Routines.Commands;
using TaskExplorer.Application.Routines.Queries.GetRoutines;

namespace TaskExplorer.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RoutinesController : ControllerBase
{
    private readonly IMediator _mediator;

    public RoutinesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<RoutineDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetRoutinesQuery()));
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateRoutineCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }
}
