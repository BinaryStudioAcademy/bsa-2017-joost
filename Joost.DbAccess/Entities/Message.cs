using Joost.DbAccess.Interfaces;
using System;

namespace Joost.DbAccess.Entities
{
    public class Message : IEntity
    {
        public int Id { get; set; }
        public User Sender { get; set; }
        public Receiver Receiver { get; set; }
        public string Text { get; set; }
        public DateTime SendingDateTime { get; set; }
        public DateTime EditingDateTime { get; set; }
    }
}
