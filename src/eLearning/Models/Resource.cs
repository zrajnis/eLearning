using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.ModelState
{
    public class Resource
    {
        [Key]
        public int ResourceId { get; set; }
        [Required, MinLength(2), MaxLength(64)]
        public string Name { get; set; }
        [Required]
        public string Path { get; set; }

        public IList<Lesson> Lessons { get; set; } //1:N relationship so in the future its possible to implement recognizing if resource already exists which should save hard disk space
    }
}
