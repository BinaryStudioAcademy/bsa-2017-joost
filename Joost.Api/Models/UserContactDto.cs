using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.Api.Models
{
    public class UserContactDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string City { get; set; }
        public ContactState State { get; set; }
    }
}