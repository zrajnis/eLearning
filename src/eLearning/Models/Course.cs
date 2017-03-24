using System.Collections.Generic;

namespace eLearning.Models
{
    public class Course
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Owner { get; set; }
        
        public ICollection<User> Users { get; set; }

        public IList<Lesson> Lessons { get; set; }
        public IList<Exercise> Exercises { get; set; }
    }
}
