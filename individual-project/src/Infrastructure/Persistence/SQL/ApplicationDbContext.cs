using Microsoft.EntityFrameworkCore;
using Core.Entities;
using Core.Enums;

namespace Infrastructure.Persistence.SQL;

public class ApplicationDbContext : DbContext {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Otp> Otps { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity => {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).HasMaxLength(64);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(64);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(64);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(320);
            entity.Property(e => e.EmailVerified).IsRequired().HasDefaultValue(false);
            entity.Property(e => e.ProfilePicture).HasMaxLength(2048);
            entity.Property(e => e.Role).IsRequired().HasDefaultValue(UserRole.Student);
            entity.Property(e => e.Xp).IsRequired().HasDefaultValue(0);
            entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Otp entity
        modelBuilder.Entity<Otp>(entity => {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(320);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(6);
            entity.Property(e => e.ExpirationTime).IsRequired();

            entity.HasIndex(e => e.Email);
        });
    }
}