using System.Security.Claims;
using TaskExplorer.Domain.Entities;

namespace TaskExplorer.Application.Common.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
