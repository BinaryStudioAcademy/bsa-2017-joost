using Joost.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
	public interface IGroupService
	{
		Task<IEnumerable<GroupDto>> GetUserGroups(int userId);
		Task<IEnumerable<GroupDto>> GetUserGroups(string name);
		Task<GroupDto> GetUserGroupsById(int userId, int groupId);
		Task<IEnumerable<UserDetailsDto>> GetGroupMembers(int userId, int groupId);
		Task<GroupDto> AddGroup(int userId, GroupDto group);
		Task<GroupDto> EditGroup(int userId, int groupId, GroupDto group);
		Task<bool> DeleteGroup(int userId, int groupId);
	}
}
