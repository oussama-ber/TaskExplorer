using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TaskExplorer.Application.Auth.DTOs;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Application.Common.Models;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Auth.Commands.Register;

public record RegisterCommand(
    string Email,
    string Password,
    string FullName) : IRequest<AuthResponseDto?>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto?>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtSettings _jwtSettings;

    public RegisterCommandHandler(
        UserManager<User> userManager,
        IJwtTokenService jwtTokenService,
        IOptions<JwtSettings> jwtSettings)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto?> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return null;

        var user = new User
        {
            UserName = request.FullName,
            Email = request.Email,
            OnboardingCompleted = false,
            CreatedAt = DateTime.UtcNow,
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return null;

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
