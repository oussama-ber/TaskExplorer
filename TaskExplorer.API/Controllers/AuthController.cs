using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskExplorer.Application.Auth.Commands.Login;
using TaskExplorer.Application.Auth.Commands.Register;
using TaskExplorer.Application.Auth.Commands.RefreshToken;
using TaskExplorer.Application.Auth.DTOs;

namespace TaskExplorer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginCommand command)
    {
        var result = await _mediator.Send(command);
        if (result == null)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<bool>> Register(RegisterCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken(RefreshTokenCommand command)
    {
        var result = await _mediator.Send(command);
        if (result == null)
            return Unauthorized(new { message = "Invalid or expired token" });

        return Ok(result);
    }
}
