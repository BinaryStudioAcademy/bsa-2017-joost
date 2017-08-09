using System;
using System.Collections.Generic;

namespace Joost.DbAccess.Entities
{
    public class Group : Receiver
    {
        public string Name { get; set; }
        public User GroupCreator { get; set; }
        public string Description { get; set; }
        public virtual ICollection<User> Members { get; set; }
        public DateTime CreatingDateTime { get; set; }
        public DateTime LastMessageDateTime { get; set; }

        public Group()
        {
            Members = new List<User>();
        }
    }
}
