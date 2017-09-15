using Joost.DbAccess.Entities;

namespace Joost.Api.Models
{
    public class ContactDto
    {
        public int ContactId { get; set; }
        public ContactState State { get; set; }
    }
}