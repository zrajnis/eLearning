using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.Models
{
    public class Resource
    {
        [Key]
        public int ResourceId { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }

        [ForeignKey("Lesson")]
        public int LessonId { get; set; }
    }
}
