using Microsoft.EntityFrameworkCore;

namespace eLearning.Models
{
    public class eLearningContext : DbContext
    {
        public eLearningContext(DbContextOptions<eLearningContext> options) : base(options) 
        {

        }

        public eLearningContext()
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasAlternateKey(c => c.Email);

            modelBuilder.Entity<Resource>()
                .HasAlternateKey(c => c.Path);

            modelBuilder.Entity<Subscription>()
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

        public DbSet<User> Users { get; set; }
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
