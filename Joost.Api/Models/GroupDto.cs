using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Joost.Api.Models
{
    public class GroupDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        // the property need in order to fill Group.Members which User class (not UserDetailsDto!!!) in Post and/or Put methods 
        public List<int> SelectedMembersId { get; set; }
    }
}