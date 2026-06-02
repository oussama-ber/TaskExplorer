using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace TaskExplorer.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var (status, message) = exception switch
        {
            // Add custom exceptions here (e.g., UnauthorizedAccessException, etc.)
            _ => (HttpStatusCode.InternalServerError, "Internal Server Error. Please try again later.")
        };

        context.Response.StatusCode = (int)status;

        var result = JsonSerializer.Serialize(new { error = message, detail = exception.Message });
        return context.Response.WriteAsync(result);
    }
}
