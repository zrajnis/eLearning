namespace eLearning.Models
{
    public class Answer
    {
        public int AnswerId { get; set; }
        public string Sentence { get; set; }
        
        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }
}
