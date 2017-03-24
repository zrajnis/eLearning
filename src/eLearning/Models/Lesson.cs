namespace eLearning.Models
{
    public class Lesson
    {
        public int LessonId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public virtual Resource Resoruce { get; set; }
    }
}
