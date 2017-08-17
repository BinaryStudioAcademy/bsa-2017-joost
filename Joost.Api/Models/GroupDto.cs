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
        public List<int> MembersId { get; set; } // the property need for fill client group-edit.component selectedMembers list
        public List<int> ContactsId { get; set; } // the property need for fill client group-edit.component members list. Using when user wants edit the group
    }
}