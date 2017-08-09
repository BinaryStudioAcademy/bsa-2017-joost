using Joost.DbAccess.Interfaces;

namespace Joost.DbAccess.Entities
{
    public abstract class Receiver : IEntity
    {
        public int Id { get; set; }
        public string Avatar { get; set; }
    }
}
