using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class Answer
    {
        public int AnswerId { get; set; }
        [RegularExpression(@"^[\s\S]{2,120}$")]
        public string Sentence { get; set; }
        
        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }
}
