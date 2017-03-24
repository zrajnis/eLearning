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

            modelBuilder.Entity<UserCourse>()
                .HasKey(u => new { u.UserId, u.CourseId});

            modelBuilder.Entity<UserCourse>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserCourses)
                .HasForeignKey(uc => uc.UserId);

            modelBuilder.Entity<UserCourse>()
                .HasOne(uc => uc.Course)
                .WithMany(c => c.UserCourses)
                .HasForeignKey(uc => uc.CourseId);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<UserCourse> UserCourses { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; } 
    } 
}
