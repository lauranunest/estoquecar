using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "aws-1-sa-east-1.pooler.supabase.com";
var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "6543"; 
var database = Environment.GetEnvironmentVariable("DB_NAME") ?? "postgres";
var user = Environment.GetEnvironmentVariable("DB_USER") ?? "postgres.cortlcpcjkqfjchfwdkp";
var password = Environment.GetEnvironmentVariable("DB_PASS") ?? "YOUR_PASSWORD";

var connectionString = $"Host={host};Port={port};Database={database};Username={user};Password={password};Pooling=true;Maximum Pool Size=50;Trust Server Certificate=true;";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.CommandTimeout(60);     
        npgsqlOptions.EnableRetryOnFailure(5); 
    })
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
