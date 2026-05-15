using System.Text;
using System.Text.Json.Serialization;
using gtg_backend.Business;
using gtg_backend.Data;
using gtg_backend.Helpers;
using gtg_backend.Repositories;
using gtg_backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

//Todo rename this
const string gameToGatherPolicy = "GameToGatherPolicy";
const string developmentPolicy = "DevelopmentPolicy";
const string websiteAddress = "https://gametogather.de";

var builder = WebApplication.CreateBuilder(args);

// builder.Configuration
//     .AddJsonFile("appsettings.json")
//     .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true, true);

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();

builder.Services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });

//Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\nExample: \"Bearer abc123\""
    }));
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);


builder.Services.AddDbContext<GameDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("GameDbConnectionString");
    
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("CRITICAL: GameDbConnectionString is empty. Docker environment variables are not being read correctly.");
    }
    
    options.UseMySql(connectionString,
        new MariaDbServerVersion(new Version(10, 6, 22)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null));
});

//Register services etc
builder.Services.AddHostedService<NotificationWorker>();
builder.Services.AddScoped<INotificationService, TelegramNotificationService>();

//Repositories
builder.Services.AddScoped<IGameRepository, GameRepository>();

//Services
builder.Services.AddScoped<IGameService, GameService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            //Todo: reexamine Issuer and Audience implementation
            ValidIssuer = "https://gametogather.de",
            ValidAudience = "https://gametogather.de",
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ??
                                                                throw new InvalidOperationException())),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: gameToGatherPolicy,
        policy =>
        {
            //Todo: adjust this
            policy.WithOrigins(websiteAddress)
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
    options.AddPolicy(name: developmentPolicy,
        policy =>
        {
            //Todo: adjust this
            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try 
    {
        var context = services.GetRequiredService<GameDbContext>();
        // Optional: Wait a few seconds manually if you aren't using RetryOnFailure
        // System.Threading.Thread.Sleep(5000); 
        await context.Database.MigrateAsync();
        await Seeder.SeedApplication(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors(developmentPolicy);

    // app.MapOpenApi("/test");
    app.UseSwagger();
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "gtg v1")
    );
}
else if (app.Environment.IsProduction())
{
    app.UseCors(gameToGatherPolicy);
}

//Todo: for testing uncomment later
app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();