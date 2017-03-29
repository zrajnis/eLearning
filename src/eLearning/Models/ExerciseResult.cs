using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.Models
{
    public class ExerciseResult //exercise result for specific test written by specific user (N:M relationship)
    {
        public string UserId { get; set; }
        public virtual User User { get; set; }

        public int ExerciseId { get; set; }
        public virtual Exercise Exercise { get; set; }

        [Required, Range(0, 100.0)]
        public float Score { get; set; }
    }
}
