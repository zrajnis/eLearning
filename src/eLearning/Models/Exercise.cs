using System.Collections.Generic;

namespace eLearning.Models
{
    public class Exercise
    {
        public int ExerciseId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Score { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public IList<Question> Questions { get; set; }
    }
}
