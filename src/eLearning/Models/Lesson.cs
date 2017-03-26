using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class Lesson
    {
        public int LessonId { get; set; }
        [Required, RegularExpression(@"^[\s\S]{2,64}$")]
        public string Name { get; set; }
        [RegularExpression(@"^[\s\S]{2,120}$")]
        public string Description { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public virtual Resource Resoruce { get; set; }
    }
}
