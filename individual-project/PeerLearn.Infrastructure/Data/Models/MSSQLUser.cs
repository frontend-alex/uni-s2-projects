using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PeerLearn.Core.Enums;

namespace PeerLearn.Infrastructure.Data.Models;

[Table("Users")]
public sealed class MSSQLUser
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("Username")]
    public required string Username { get; set; }

    [Required]
    [MaxLength(500)]
    [Column("ProfilePicture")]
    public required string ProfilePicture { get; set; }

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    [Column("Email")]
    public required string Email { get; set; }

    [Required]
    [Column("Role")]
    public required Role Role { get; set; }

    [Required]
    [Column("Xp")]
    public required int Xp { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("Password")]
    public required string Password { get; set; }

    [Required]
    [Column("EmailVerified")]
    public required bool EmailVerified { get; set; }

    [Required]
    [Column("HasPassword")]
    public required bool HasPassword { get; set; }

    [Required]
    [Column("Provider")]
    public required Provider Provider { get; set; }

    [Required]
    [Column("LastLoginAt")]
    public required DateTime LastLoginAt { get; set; }

    [Required]
    [Column("OnBoardingCompleted")]
    public required bool OnBoardingCompleted { get; set; }

    [Required]
    [Column("CreatedAt")]
    public required DateTime CreatedAt { get; set; }

    [Required]
    [Column("UpdatedAt")]
    public required DateTime UpdatedAt { get; set; }
}
