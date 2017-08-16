using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
