using Joost.DbAccess.Entities;
using System;

namespace Joost.Api.Models
{
	public class UserDetailsDto
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
        public bool IsOnline { get; set; }
        public bool Notifications { get; set; }

		public static UserDetailsDto FromModel(User model)
		{
            if (model == null)
                return null;
            else
                return new UserDetailsDto()
                {
                    Id = model.Id,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    City = model.City,
                    Country = model.Country,
                    BirthDate = model.BirthDate,
                    Gender = model.Gender,
                    Status = model.Status,
                    Avatar = model.Avatar,
                    State = model.State,
                    Notifications = model.Notifications,
                    IsOnline = model.IsOnline
				};
		}
	}
}