﻿namespace eLearning.Models
{
    public class UserCourse
    {
        public int UserId { get; set; }
        public virtual User User { get; set; }

        public int CourseId { get; set; } 
        public virtual Course Course { get; set; }
    }
}
