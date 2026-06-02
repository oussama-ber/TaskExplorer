using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TaskExplorer.Application.Users.Queries.GetCurrentUser;

namespace TaskExplorer.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _mediator.Send(new GetCurrentUserQuery(userId));
        
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost("complete-onboarding")]
    public async Task<ActionResult<bool>> CompleteOnboarding()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await _mediator.Send(new TaskExplorer.Application.Users.Commands.CompleteOnboarding.CompleteOnboardingCommand(userId));
        
        if (!result) return BadRequest(new { message = "Failed to complete onboarding" });

        return Ok(true);
    }
}
