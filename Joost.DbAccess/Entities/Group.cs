using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;

namespace Joost.DbAccess.Entities
{
    public class Group : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public User GroupCreator { get; set; }
        public string Description { get; set; }
        public virtual ICollection<User> Members { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastMessageAt { get; set; }

        public Group()
        {
            Members = new List<User>();
        }
    }
}
