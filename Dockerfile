# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydatabase

# Expose the default PostgreSQL port
EXPOSE 5432

# Add a custom initialization script (optional)
# COPY init.sql /docker-entrypoint-initdb.d/

# The default command will run the PostgreSQL server
CMD ["postgres"]