using System.Linq.Expressions;
using gtg_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace gtg_backend.Data;

public class GameDbContext(DbContextOptions options) : DbContext(options)
{
    
    public override int SaveChanges()
    {
        ApplyAuditInfo();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditInfo();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditInfo()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries().Where(e => e.Entity is ModelBase))
        {
            var entity = (ModelBase)entry.Entity;

            switch (entry.State)
            {
                case EntityState.Added:
                    entity.CreatedAt = now;
                    entity.UpdatedAt = now;
                    entity.IsDeleted = false;
                    entity.DeletedAt = null;
                    break;

                case EntityState.Modified:
                    entity.UpdatedAt = now;
                    break;

                case EntityState.Deleted:
                    entry.State = EntityState.Modified; // Soft delete
                    entity.IsDeleted = true;
                    entity.DeletedAt = now;
                    entity.UpdatedAt = now;
                    break;
            }


            UpdateMeetingWhenChildrenUpdate(entry, now);
        }
    }

    private void UpdateMeetingWhenChildrenUpdate(EntityEntry entry, DateTime now)
    {
        if (entry.Entity is MeetDateSuggestion suggestion)
        {
            var meetingEntry = ChangeTracker
                .Entries<Meet>()
                .FirstOrDefault(e => e.Entity.Id == suggestion.MeetId)?.Entity;

            if (meetingEntry == null)
            {
                meetingEntry = Find<Meet>(suggestion.MeetId);
            }

            if (meetingEntry != null)
            {
                meetingEntry.UpdatedAt = now;
            }

        }

        if (entry.Entity is MeetUserVote vote)
        {
            var targetMeetUserId = vote.MeetUserId;
                
            var meetId = ChangeTracker.Entries<MeetUser>()
                .FirstOrDefault(e => e.Entity.Id == targetMeetUserId)?.Entity.MeetId;
                
            if (meetId == null)
            {
                meetId = Set<MeetUser>()
                    .Where(mu => mu.Id == targetMeetUserId)
                    .Select(mu => mu.MeetId)
                    .FirstOrDefault();
            }
                
            if (meetId != null)
            {
                var meetingToUpdate = Find<Meet>(meetId);
        
                if (meetingToUpdate != null)
                {
                    meetingToUpdate.UpdatedAt = now;
                    Entry(meetingToUpdate).Property(m => m.UpdatedAt).IsModified = true;
                }
            }
        }
    }
    
    public DbSet<Activity> Activities { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Food> Foods { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GameGenre> GameGenres { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupUser> GroupUsers { get; set; }
    public DbSet<GroupUserMessage> GroupUserMessages { get; set; }
    public DbSet<GroupUserVote> GroupUserVotes { get; set; }
    public DbSet<GroupSettings> GroupSettings { get; set; }
    
    public DbSet<Image> Images { get; set; }
    public DbSet<Meet> Meets { get; set; }
    public DbSet<MeetActivity> MeetActivities { get; set; }
    public DbSet<MeetUserVote> MeetUserVote { get; set; }
    public DbSet<MeetDateSuggestion> MeetDateSuggestions { get; set; }
    public DbSet<MeetUser> MeetUsers { get; set; }
    public DbSet<MeetUserMessage> MeetUserMessages { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        //Needed for soft delete
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ModelBase).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var isDeletedProperty = Expression.Property(parameter, nameof(ModelBase.IsDeleted));
                var condition = Expression.Equal(isDeletedProperty, Expression.Constant(false));
                var lambda = Expression.Lambda(condition, parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }
        
        modelBuilder.Entity<Activity>()
            .HasKey(x => x.Id);
        modelBuilder.Entity<Activity>()
            .HasOne<Group>(activity => activity.Group)
            .WithMany(group => group.Activities)
            .HasForeignKey(activity => activity.GroupId);
        
        modelBuilder.Entity<Assignment>()
            .HasKey(x => x.Id);
        modelBuilder.Entity<Assignment>()
            .HasOne<MeetUser>(assignment => assignment.MeetUser)
            .WithMany(meetUser => meetUser.Assignments)
            .HasForeignKey(assignment => assignment.MeetUserId);
        
        modelBuilder.Entity<Food>()
            .HasKey(x => x.Id);
        modelBuilder.Entity<Food>()
            .HasOne<MeetUser>(food => food.MeetUser)
            .WithMany(meetUser => meetUser.Foods)
            .HasForeignKey(food => food.MeetUserId);
        modelBuilder.Entity<Food>()
            .Property(food => food.FoodType)
            .HasConversion<string>();
        
        modelBuilder.Entity<GameGenre>()
            .HasKey(gameGenre => gameGenre.Id);
        modelBuilder.Entity<GameGenre>()
            .HasOne<Group>(genre => genre.Group)
            .WithMany(group => group.GameGenres)
            .HasForeignKey(genre => genre.GroupId);
        
        modelBuilder.Entity<Game>()
            .HasKey(game => game.Id);
        modelBuilder.Entity<Game>()
            .HasOne<User>(game => game.User)
            .WithMany(user => user.Games)
            .HasForeignKey(game => game.UserId);
        modelBuilder.Entity<Game>()
            .HasOne<GameGenre>(game => game.GameGenre)
            .WithMany(genre => genre.Games)
            .HasForeignKey(game => game.GenreId);
        modelBuilder.Entity<Game>()
            .HasOne<Image>(game => game.Image)
            .WithMany(image => image.Games)
            .HasForeignKey(game => game.ImageId);
        
        modelBuilder.Entity<Group>()
            .HasKey(group => group.Id);

        modelBuilder.Entity<GroupUser>()
            .HasKey(groupUser => groupUser.Id);
        modelBuilder.Entity<GroupUser>()
            .HasOne<Group>(groupUser => groupUser.Group)
            .WithMany(group => group.GroupUsers)
            .HasForeignKey(groupUser => groupUser.GroupId);
        modelBuilder.Entity<GroupUser>()
            .HasOne<User>(groupUser => groupUser.User)
            .WithMany(user => user.GroupUsers)
            .HasForeignKey(groupUser => groupUser.UserId);
        
        modelBuilder.Entity<GroupUserMessage>()
            .HasKey(groupUserMessage => groupUserMessage.Id);
        modelBuilder.Entity<GroupUserMessage>()
            .HasOne<GroupUser>(groupUserMessage => groupUserMessage.GroupUser)
            .WithMany(groupUser => groupUser.GroupUserMessages)
            .HasForeignKey(groupUserMessage => groupUserMessage.GroupUserId);

        modelBuilder.Entity<GroupUserVote>()
            .HasKey(groupUserVote => groupUserVote.Id);
        modelBuilder.Entity<GroupUserVote>()
            .HasOne<GroupUser>(groupUserVote => groupUserVote.GroupUser)
            .WithMany(groupUser => groupUser.GroupUserVotes)
            .HasForeignKey(groupUserVote => groupUserVote.GroupUserId);
        modelBuilder.Entity<GroupUserVote>()
            .Property(groupUserVote => groupUserVote.VotableItemType)
            .HasConversion<string>();
        
        modelBuilder.Entity<GroupSettings>()
            .HasKey(groupSettings => groupSettings.Id);
        modelBuilder.Entity<Group>()
            .HasOne(group => group.GroupSettings)
            .WithOne(groupSettings => groupSettings.Group)
            .HasForeignKey<GroupSettings>(groupSettings => groupSettings.GroupId)
            .IsRequired();
        
        
        modelBuilder.Entity<Image>()
            .HasKey(image => image.Id);
        
        modelBuilder.Entity<Meet>()
            .HasKey(meet => meet.Id);
        modelBuilder.Entity<Meet>()
            .HasOne<Group>(meet => meet.Group)
            .WithMany(group => group.Meets)
            .HasForeignKey(meet => meet.GroupId);
        
        modelBuilder.Entity<MeetActivity>()
            .HasKey(meetActivity => meetActivity.Id);
        modelBuilder.Entity<MeetActivity>()
            .HasOne<Meet>(meetActivity => meetActivity.Meet)
            .WithMany(meet => meet.MeetActivities)
            .HasForeignKey(meetActivity => meetActivity.MeetId);
        modelBuilder.Entity<MeetActivity>()
            .HasOne<Activity>(meetActivity => meetActivity.Activity)
            .WithMany(activity => activity.MeetActivities)
            .HasForeignKey(meetActivity => meetActivity.ActivityId);
        
        modelBuilder.Entity<MeetDateSuggestion>()
            .HasKey(meetDateSuggestion => meetDateSuggestion.Id);
        modelBuilder.Entity<MeetDateSuggestion>()
            .HasOne<Meet>(meetDateSuggestion => meetDateSuggestion.Meet)
            .WithMany(meet => meet.MeetDateSuggestions)
            .HasForeignKey(meetDateSuggestion => meetDateSuggestion.MeetId);
        
        modelBuilder.Entity<MeetUser>()
            .HasKey(meetUser => meetUser.Id);
        modelBuilder.Entity<MeetUser>()
            .HasOne<Meet>(meetUser => meetUser.Meet)
            .WithMany(meet => meet.MeetUsers)
            .HasForeignKey(meetUser => meetUser.MeetId);
        modelBuilder.Entity<MeetUser>()
            .HasOne<User>(meetUser => meetUser.User)
            .WithMany(user => user.MeetUsers)
            .HasForeignKey(meetUser => meetUser.UserId);
        
        modelBuilder.Entity<MeetUserMessage>()
            .HasKey(meetUserMessage => meetUserMessage.Id);
        modelBuilder.Entity<MeetUserMessage>()
            .HasOne<MeetUser>(meetUserMessage => meetUserMessage.MeetUser)
            .WithMany(meetUser => meetUser.MeetUserMessages)
            .HasForeignKey(meetUserMessage => meetUserMessage.MeetUserId);
        
        modelBuilder.Entity<MeetUserVote>()
            .HasKey(meetUserVote => meetUserVote.Id);
        modelBuilder.Entity<MeetUserVote>()
            .HasOne<MeetUser>(meetUserVote => meetUserVote.MeetUser)
            .WithMany(meetUserVote => meetUserVote.MeetUserVotes)
            .HasForeignKey(meetUserVote => meetUserVote.MeetUserId);
        modelBuilder.Entity<MeetUserVote>()
            .Property(meetUserVote => meetUserVote.VotableItemType)
            .HasConversion<string>();
        
        modelBuilder.Entity<Movie>()
            .HasKey(movie => movie.Id);
        modelBuilder.Entity<Movie>()
            .HasOne<MeetUser>(movie => movie.MeetUser)
            .WithMany(meetUser => meetUser.Movies)
            .HasForeignKey(movie => movie.MeetUserId);
        
        modelBuilder.Entity<Role>()
            .HasKey(role => role.Id);
        
        modelBuilder.Entity<User>()
            .HasKey(user => user.Id);
        modelBuilder.Entity<User>()
            .HasOne<Role>(user => user.Role)
            .WithMany(role => role.Users)
            .HasForeignKey(user => user.RoleId);
        
    }
}