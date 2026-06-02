---
description: How to run the .NET API and database
---

## 🎯 Daily Usage (After Initial Setup)

Once you've completed the initial setup below, you only need to do this each time:

```bash
# The database container will auto-start with Docker Desktop
# Just run the API:
dotnet run --project TaskExplorer.API
```

The API will be available at `http://localhost:5255` and Swagger at `http://localhost:5255/swagger`.

---

## 🔧 Initial Setup (One-Time Only)

### 1. Start the Database
Ensure Docker Desktop is running, then start the SQL Server container:
```bash
docker-compose up -d
```

> **Note**: The database container is configured with `restart: unless-stopped`, so it will automatically start whenever Docker Desktop starts.

### 2. Install EF Core Tools (if not installed)
If you don't have the `dotnet-ef` tool installed, run:
```bash
dotnet tool install --global dotnet-ef
```

### 3. Create and Apply Initial Migration (Already Done ✅)
The database has already been created with all tables. You don't need to run these commands again:
```bash
# Already completed - no need to run again
# dotnet ef migrations add InitialCreate -p TaskExplorer.Infrastructure -s TaskExplorer.API
# dotnet ef database update -p TaskExplorer.Infrastructure -s TaskExplorer.API
```

---

## 📝 Summary

**After closing your Mac:**
- ✅ Database data persists (stored in Docker volume)
- ✅ Database container auto-starts when you open Docker Desktop
- ✅ Just run `dotnet run --project TaskExplorer.API` to start coding!

**You only need migrations when:**
- Adding new tables/columns to your database schema
- Making changes to your entity models
