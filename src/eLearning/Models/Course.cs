using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class Course
    {
        public int Id { get; set; }
        [Required, MinLength(2), MaxLength(64)]
        public string Name { get; set; }
        [MinLength(2), MaxLength(240)]
        public string Description { get; set; }
        [Required]
        public string Owner { get; set; }

        public List<Subscription> Subscriptions { get; set; }

        public IList<Lesson> Lessons { get; set; }
        public IList<Exercise> Exercises { get; set; }
    }
}
