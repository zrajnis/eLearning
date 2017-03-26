using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.Models
{
    public class Resource
    {
        [Key]
        public int ResourceId { get; set; }
        [Required, RegularExpression(@"^[\s\S]{2,64}$")]
        public string Name { get; set; }
        [Required]
        public string Path { get; set; }

        [ForeignKey("Lesson")]
        public int LessonId { get; set; }
    }
}
