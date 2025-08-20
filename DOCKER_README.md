# Docker Setup for NestJS Application

This project includes Docker and Docker Compose configuration for easy development and deployment.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone and navigate to the project directory**
   ```bash
   cd srv
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Stop all services**
   ```bash
   docker-compose down
   ```

## Services

### 1. NestJS Application (`app`)
- **Port**: 3000
- **Health Check**: http://localhost:3000/health
- **Environment Variables**:
  - `NODE_ENV`: production
  - `PORT`: 3000
  - `DB_HOST`: postgres
  - `DB_PORT`: 5432
  - `DB_DATABASE`: hr
  - `DB_USERNAME`: postgres
  - `DB_PASSWORD`: qwepoi123
  - `JWT_SECRET`: [your-secret-key]

### 2. PostgreSQL Database (`postgres`)
- **Port**: 5432
- **Database**: hr
- **Username**: postgres
- **Password**: qwepoi123
- **Data Persistence**: Uses Docker volume `postgres_data`

### 3. pgAdmin (Optional)
- **Port**: 5050
- **Email**: admin@admin.com
- **Password**: admin
- **Profile**: tools (run with `docker-compose --profile tools up -d`)

## Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the `.env` file** with your desired values:

```env
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=hr
DB_USERNAME=postgres
DB_PASSWORD=qwepoi123

# JWT Configuration
JWT_SECRET=your-secret-key-here

# PostgreSQL Configuration (for docker-compose)
POSTGRES_DB=hr
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwepoi123

# pgAdmin Configuration (optional)
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

**Important:** Change the default passwords and JWT secret in production!

## Useful Commands

### Development
```bash
# Start with pgAdmin
docker-compose --profile tools up -d

# Rebuild and start
docker-compose up --build -d

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Database Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d hr

# Run migrations
docker-compose exec app npm run migration:run

# Reset database
docker-compose down -v
docker-compose up -d
```

### Production
```bash
# Start in production mode
NODE_ENV=production docker-compose up -d

# Scale application
docker-compose up -d --scale app=3
```

## Health Checks

- **Application**: http://localhost:3000/health
- **Database**: Automatically checked by Docker Compose
- **pgAdmin**: http://localhost:5050

## Troubleshooting

### Application won't start
1. Check if PostgreSQL is running: `docker-compose ps`
2. Check application logs: `docker-compose logs app`
3. Ensure database is ready before starting app

### Database connection issues
1. Verify PostgreSQL container is healthy: `docker-compose ps postgres`
2. Check database logs: `docker-compose logs postgres`
3. Ensure environment variables are correct

### Port conflicts
If ports 3000, 5432, or 5050 are already in use, modify the `docker-compose.yml` file to use different ports.

## Security Notes

- Change default passwords in production
- Use strong JWT secrets
- Consider using Docker secrets for sensitive data
- Enable SSL/TLS for database connections in production 