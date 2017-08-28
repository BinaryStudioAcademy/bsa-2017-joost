using Joost.DbAccess.Interfaces;
using System;

namespace Joost.DbAccess.Entities
{
    public class GroupMessage : IEntity
    {
        public int Id { get; set; }
        public User Sender { get; set; }
        public Group Receiver { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EditedAt { get; set; }
        public string AttachedFile { get; set; }
    }
}
