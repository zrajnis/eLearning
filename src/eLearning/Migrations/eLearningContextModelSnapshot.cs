using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using eLearning.Models;

namespace eLearning.Migrations
{
    [DbContext(typeof(eLearningContext))]
    partial class eLearningContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("eLearning.Models.Answer", b =>
                {
                    b.Property<int>("AnswerId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("QuestionId");

                    b.Property<string>("Sentence");

                    b.HasKey("AnswerId");

                    b.HasIndex("QuestionId");

                    b.ToTable("Answers");
                });

            modelBuilder.Entity("eLearning.Models.Course", b =>
                {
                    b.Property<int>("CourseId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Owner")
                        .IsRequired();

                    b.HasKey("CourseId");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("eLearning.Models.Exercise", b =>
                {
                    b.Property<int>("ExerciseId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CourseId");

                    b.Property<string>("Description");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("ExerciseId");

                    b.HasIndex("CourseId");

                    b.ToTable("Exercises");
                });

            modelBuilder.Entity("eLearning.Models.ExerciseResult", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<int>("ExerciseId");

                    b.Property<float>("Score");

                    b.HasKey("UserId", "ExerciseId");

                    b.HasIndex("ExerciseId");

                    b.ToTable("ExerciseResults");
                });

            modelBuilder.Entity("eLearning.Models.Lesson", b =>
                {
                    b.Property<int>("LessonId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CourseId");

                    b.Property<string>("Description");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("LessonId");

                    b.HasIndex("CourseId");

                    b.ToTable("Lessons");
                });

            modelBuilder.Entity("eLearning.Models.Question", b =>
                {
                    b.Property<int>("QuestionId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ExerciseId");

                    b.Property<int>("Points");

                    b.Property<string>("Sentence")
                        .IsRequired();

                    b.HasKey("QuestionId");

                    b.HasIndex("ExerciseId");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("eLearning.Models.Resource", b =>
                {
                    b.Property<int>("ResourceId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("LessonId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Path")
                        .IsRequired();

                    b.HasKey("ResourceId");

                    b.HasAlternateKey("Path");

                    b.HasIndex("LessonId")
                        .IsUnique();

                    b.ToTable("Resources");
                });

            modelBuilder.Entity("eLearning.Models.Subscription", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<int>("CourseId");

                    b.HasKey("UserId", "CourseId");

                    b.HasIndex("CourseId");

                    b.ToTable("Subscriptions");
                });

            modelBuilder.Entity("eLearning.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("FirstName")
                        .IsRequired();

                    b.Property<string>("LastName")
                        .IsRequired();

                    b.Property<string>("Password")
                        .IsRequired();

                    b.HasKey("UserId");

                    b.HasAlternateKey("Email");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("eLearning.Models.Answer", b =>
                {
                    b.HasOne("eLearning.Models.Question", "Question")
                        .WithMany("Answers")
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("eLearning.Models.Exercise", b =>
                {
                    b.HasOne("eLearning.Models.Course", "Course")
                        .WithMany("Exercises")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("eLearning.Models.ExerciseResult", b =>
                {
                    b.HasOne("eLearning.Models.Exercise", "Exercise")
                        .WithMany("ExerciseResults")
                        .HasForeignKey("ExerciseId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("eLearning.Models.User", "User")
                        .WithMany("ExerciseResults")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("eLearning.Models.Lesson", b =>
                {
                    b.HasOne("eLearning.Models.Course", "Course")
                        .WithMany("Lessons")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("eLearning.Models.Question", b =>
                {
                    b.HasOne("eLearning.Models.Exercise", "Exercise")
                        .WithMany("Questions")
                        .HasForeignKey("ExerciseId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("eLearning.Models.Resource", b =>
                {
                    b.HasOne("eLearning.Models.Lesson")
                        .WithOne("Resoruce")
                        .HasForeignKey("eLearning.Models.Resource", "LessonId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("eLearning.Models.Subscription", b =>
                {
                    b.HasOne("eLearning.Models.Course", "Course")
                        .WithMany("Subscriptions")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("eLearning.Models.User", "User")
                        .WithMany("Subscriptions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
