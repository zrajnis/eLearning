using System;
using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class Lesson
    {
        public int LessonId { get; set; }
        [Required, MinLength(2), MaxLength(64)]
        public string Name { get; set; }
        [MinLength(2), MaxLength(120)]
        public string Description { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public virtual Resource Resoruce { get; set; }
    }
}
