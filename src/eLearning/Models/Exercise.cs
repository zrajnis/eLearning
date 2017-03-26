using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class Exercise
    {
        public int ExerciseId { get; set; }
        [Required, RegularExpression(@"^[\s\S]{2,64}$")]
        public string Name { get; set; }
        [RegularExpression(@"^[\s\S]{2,120}$")]
        public string Description { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public IList<Question> Questions { get; set; }
        public List<ExerciseResult> ExerciseResults { get; set; }
    }
}
