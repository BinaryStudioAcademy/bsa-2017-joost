using Joost.DbAccess.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Joost.Api.Models
{
    public class GroupDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
		public string Avatar { get; set; }

		// the property need in order to fill Group.Members which User class (not UserDetailsDto!!!) in Post and/or Put methods 
		public List<int> SelectedMembersId { get; set; }

		public static GroupDto FromModel(Group model)
		{
			if (model == null)
			{
				return null;
			}
			else
			{

				var selectedMembersId = model.Members.Select(m => m.Id);
				return new GroupDto()
				{
					Id = model.Id,
					Name = model.Name,
					Description = model.Description,
					SelectedMembersId = selectedMembersId.ToList(),
					Avatar = model.Avatar
				};
			}
		}
	}
}