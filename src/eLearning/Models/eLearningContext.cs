using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace eLearning.Models
{
    public class eLearningContext : IdentityDbContext<User>
    {
        public eLearningContext(DbContextOptions<eLearningContext> options) : base(options) 
        {

        }

        public eLearningContext()
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasAlternateKey(c => c.Email);
            modelBuilder.Entity<User>().Ignore(u => u.Password); //only hashed password is saved to the db(security reasons)
            modelBuilder.Entity<User>().ToTable("Users");

            modelBuilder.Entity<Resource>()
                .HasAlternateKey(c => c.Path);

            modelBuilder.Entity<Subscription>() //subscription and exercise are M:N tables so theres some overriding to do
                .HasKey(s => new { s.UserId, s.CourseId});

            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.User)
                .WithMany(s => s.Subscriptions)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.Course)
                .WithMany(s => s.Subscriptions)
                .HasForeignKey(s => s.CourseId);

            modelBuilder.Entity<ExerciseResult>()
                .HasKey(er => new { er.UserId, er.ExerciseId });

            modelBuilder.Entity<ExerciseResult>()
                .HasOne(er => er.User)
                .WithMany(er => er.ExerciseResults)
                .HasForeignKey(er => er.UserId);

            modelBuilder.Entity<ExerciseResult>()
                .HasOne(er => er.Exercise)
                .WithMany(er => er.ExerciseResults)
                .HasForeignKey(er => er.ExerciseId);
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<ExerciseResult> ExerciseResults { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; } 
    } 
}
