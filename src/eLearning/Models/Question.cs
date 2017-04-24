using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class Question
    {
        public int Id { get; set; }
        [Required, MinLength(2), MaxLength(120)]
        public string Sentence { get; set; }
        [Required, Range(0, 100.0)]
        public float Points { get; set; }

        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; }

        public IList<Answer> Answers { get; set; }
    }
}
