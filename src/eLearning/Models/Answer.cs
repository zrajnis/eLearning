using System;
using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class Answer
    {
        public int Id { get; set; }
        [Required, MinLength(2), MaxLength(120)]
        public string Sentence { get; set; }
        public bool IsCorrect { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }
}
