using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Joost.DbAccess.Entities
{
    public class Connection: IEntity
    {
        public int Id { get; set; }
        public bool Connected { get; set; }
    }
}
