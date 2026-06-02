using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TaskExplorer.Application.Common.Models;
using TaskExplorer.Application.Auth.DTOs;
using TaskExplorer.Application.Common.Interfaces;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Auth.Commands.RefreshToken;

public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<AuthResponseDto?>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponseDto?>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtSettings _jwtSettings;

    public RefreshTokenCommandHandler(
        UserManager<User> userManager,
        IJwtTokenService jwtTokenService,
        IOptions<JwtSettings> jwtSettings)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto?> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var principal = _jwtTokenService.GetPrincipalFromExpiredToken(request.AccessToken);
        if (principal == null)
            return null;

        var email = principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email))
            return null;

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return null;

        var newAccessToken = _jwtTokenService.GenerateAccessToken(user);
        var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60,
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email!,
                Name = user.UserName!
            }
        };
    }
}
