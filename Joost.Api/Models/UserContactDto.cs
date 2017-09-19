using Joost.DbAccess.Entities;

namespace Joost.Api.Models
{
    public class UserContactDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string City { get; set; }
        public ContactState State { get; set; }
        public UserState UserState { get; set; }
        public bool IsOnline { get; set; }
    }
}