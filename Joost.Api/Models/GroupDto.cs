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

        public List<UserContactDto> SelectedMembers { get; set; }

        // the property need when we GetGroup by groupId, because client side has 2 collections (with selected and unselected members and we must fill its)
        public List<UserContactDto> UnselectedMembers { get; set; } 
    }
}