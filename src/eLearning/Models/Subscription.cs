using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.ModelState
{
    public class Subscription //determines which user is subscribed to which course (N:M relationship)
    {
        public string UserId { get; set; }
        public virtual User User { get; set; }

        public int CourseId { get; set; } 
        public virtual Course Course { get; set; }
    }
}
