using Joost.DbAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.Api.Models.Extentions
{
	public static class UserUserDetailsDTO
	{
		public static UserDetailsDTO ToUserDetailsDTO(this User user)
		{
			if (user == null)
				return null;
			else
				return new UserDetailsDTO()
				{
					Id = user.Id,
					FirstName = user.FirstName,
					LastName = user.LastName,
					City = user.City,
					Country = user.Country,
					BirthDate = user.BirthDate,
					Gender = user.Gender,
					Status = user.Status,
					Avatar = user.Avatar,
					State = user.State
				};
		}
	}
}