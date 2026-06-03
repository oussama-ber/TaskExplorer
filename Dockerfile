# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution file and project files
COPY ["TaskExplorer.sln", "./"]
COPY ["TaskExplorer.API/TaskExplorer.API.csproj", "TaskExplorer.API/"]
COPY ["TaskExplorer.Application/TaskExplorer.Application.csproj", "TaskExplorer.Application/"]
COPY ["TaskExplorer.Domain/TaskExplorer.Domain.csproj", "TaskExplorer.Domain/"]
COPY ["TaskExplorer.Infrastructure/TaskExplorer.Infrastructure.csproj", "TaskExplorer.Infrastructure/"]
COPY ["nuget.config", "./"]

# Restore dependencies
RUN dotnet restore

# Copy all source files
COPY . .

# Build the API
WORKDIR "/src/TaskExplorer.API"
RUN dotnet build "TaskExplorer.API.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "TaskExplorer.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 80 or 8080 (Render/Azure often use 8080 by default)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TaskExplorer.API.dll"]
