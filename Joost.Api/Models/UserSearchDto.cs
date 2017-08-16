using Joost.DbAccess.Entities;

namespace Joost.Api.Models
{
    public class UserSearchDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string City { get; set; }

		public static UserSearchDto FromModel(User model)
		{
			if (model == null)
				return null;
			else
				return new UserSearchDto()
				{
					Id = model.Id,
					City = model.City,
					Avatar = model.Avatar,
					Name = model.FirstName + " " + model.LastName,
				};
		}
	}
}