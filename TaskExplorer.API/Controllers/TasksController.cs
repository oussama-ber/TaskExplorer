using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using TaskExplorer.Application.Tasks.Commands.CreateTask;
using TaskExplorer.Application.Tasks.Commands.UpdateTask;
using TaskExplorer.Application.Tasks.Commands.DeleteTask;
using TaskExplorer.Application.Tasks.Queries.GetTasksByGoal;
using TaskExplorer.Application.Tasks.Queries.GetAllTasks;

namespace TaskExplorer.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllTasksQuery()));
    }

    [HttpGet("goal/{goalId}")]
    public async Task<ActionResult<List<TaskDto>>> GetByGoal(Guid goalId)
    {
        return Ok(await _mediator.Send(new GetTasksByGoalQuery(goalId)));
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateTaskCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, UpdateTaskCommand command)
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
        await _mediator.Send(new DeleteTaskCommand(id));
        return NoContent();
    }
}
