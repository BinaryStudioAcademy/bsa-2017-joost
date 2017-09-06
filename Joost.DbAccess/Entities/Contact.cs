using Joost.DbAccess.Interfaces;

namespace Joost.DbAccess.Entities
{
    public class Contact:IEntity
    {
        public int Id { get; set; }
        public ContactState State { get; set; }

        public virtual User User { get; set; }
        public virtual User ContactUser { get; set; }
    }
    public enum ContactState
    {
        New,
        Sent,
        Accept,
        Decline
    }
}
