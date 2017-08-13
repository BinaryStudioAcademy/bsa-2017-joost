using Joost.DbAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.Api.Models
{
	public class UserDetailsDTO
	{
		public int Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		public DateTime BirthDate { get; set; }
		public Gender Gender { get; set; }
		public string Status { get; set; }
		public string Avatar { get; set; }
		public UserState State { get; set; }
	}
}