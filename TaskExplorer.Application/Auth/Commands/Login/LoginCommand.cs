using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TaskExplorer.Application.Common.Models;
using TaskExplorer.Application.Auth.DTOs;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Auth.Commands.Login;

public record LoginCommand(
    string Email,
    string Password) : IRequest<AuthResponseDto?>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto?>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtSettings _jwtSettings;

    public LoginCommandHandler(
        UserManager<User> userManager,
        IJwtTokenService jwtTokenService,
        IOptions<JwtSettings> jwtSettings)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return null;
        }

        var accessToken = _jwtTokenService.GenerateAccessToken(user);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);

        await _userManager.UpdateAsync(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60,
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email!,
                Name = user.UserName!,
                OnboardingCompleted = user.OnboardingCompleted
            }
        };
    }
}
