using Joost.DbAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.Api.Models
{
	public class UserProfileDto
	{
		public int Id { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		public DateTime BirthDate { get; set; }
		public Gender Gender { get; set; }
		public string Status { get; set; }
		public string Avatar { get; set; }
		public UserState State { get; set; }
		public bool IsActived { get; set; }
        public bool IsOnline { get; set; }

        public static UserProfileDto FromModel(User model)
		{
			if (model == null)
				return null;
			else
				return new UserProfileDto()
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
					Email = model.Email,
					IsActived = model.IsActived,
					Password = model.Password,
                    IsOnline = model.IsOnline
				};
		}
	}
}