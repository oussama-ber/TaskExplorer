using MediatR;

namespace TaskExplorer.Application.Users.Queries.GetCurrentUser;

public record GetCurrentUserQuery(string UserId) : IRequest<UserDto?>;
