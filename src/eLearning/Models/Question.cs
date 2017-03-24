using System.Collections.Generic;

namespace eLearning.Models
{
    public class Question
    {
        public int QuestionId { get; set; }
        public string Sentence { get; set; }

        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; }

        public IList<Answer> Answers { get; set; }
    }
}
