using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Joost.Api.Models;
using Joost.DbAccess.Interfaces;
using Joost.DbAccess.Entities;
using System.Data.Entity;
using System.IO;

namespace Joost.Api.Services
{
	public class GroupService : IGroupService
	{
		private IUnitOfWork _unitOfWork;

		public GroupService(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
		}

		public async Task<IEnumerable<GroupDto>> GetUserGroups(int userId)
		{
			return (await _unitOfWork.Repository<Group>().AllAsync()).Where(item => item.Members.Any(i => i.Id == userId))
				.ToList()
				.Select(gr => GroupDto.FromModel(gr));

		}

		public async Task<IEnumerable<GroupDto>> GetUserGroups(string name)
		{
			return (await _unitOfWork.Repository<Group>()
			   .Query()
			   .Include(g => g.Members)
			   .Where(item => item.Name.Contains(name))
			   .ToListAsync())
			   .Select(gr => GroupDto.FromModel(gr));
		}

		public async Task<GroupDto> GetUserGroupsById(int userId, int groupId)
		{
			var group = await _unitOfWork.Repository<Group>()
			   .Query()
			   .Include(g => g.Members)
			   .SingleAsync(g => g.Id == groupId);

			var selectedMembersId = group.Members.Select(m => m.Id);
			if (group != null)
			{
				if (selectedMembersId.Contains(userId))
					return GroupDto.FromModel(group);
				else
					return null;
			}
			else
				return null;
		}

		public async Task<IEnumerable<UserDetailsDto>> GetGroupMembers(int userId, int groupId)
		{
			var group = await _unitOfWork.Repository<Group>()
				.Query()
				.Include(g => g.Members)
				.SingleAsync(g => g.Id == groupId);

			var selectedMembersId = group.Members.Select(m => m.Id);
			if (group != null)
			{
				if (selectedMembersId.Contains(userId))
					return group.Members.Select(m => UserDetailsDto.FromModel(m));
				else
					return null;
			}
			else
				return null;
		}

		public async Task AddGroup(int userId, GroupDto group)
		{
			if (group == null)
				return;
			var newGroup = new Group()
			{
				Name = group.Name,
				CreatedAt = DateTime.Now,
				Description = group.Description,
				GroupCreator = await _unitOfWork.Repository<User>().GetAsync(userId),
				Avatar = group.Avatar
			};

			foreach (var memberId in group.SelectedMembersId)
				newGroup.Members.Add(await _unitOfWork.Repository<User>().GetAsync(memberId));
			newGroup.Members.Add(newGroup.GroupCreator);

			_unitOfWork.Repository<Group>().Add(newGroup);
			await _unitOfWork.SaveAsync();

			var newGr = _unitOfWork.Repository<Group>().All().LastOrDefault();
			if (newGr.Avatar != "")
			{
				string folderPath = HttpContext.Current.Server.MapPath("~/App_Data/AttachedFiles/");

				var filePath = Directory.EnumerateFiles(folderPath, newGr.Avatar + ".*", SearchOption.AllDirectories)
				.Where(s => s.EndsWith(".jpg") || s.EndsWith(".png") || s.EndsWith(".bmp") || s.EndsWith(".gif")).FirstOrDefault();

				if (filePath != null)
				{
					string fileType = filePath.Substring(filePath.LastIndexOf('.') + 1);
					string destPath = HttpContext.Current.Server.MapPath("~/App_Data/Avatars/") + newGr.Id + "_g_avatar." + fileType;
					try
					{
						File.Delete(destPath);
						File.Move(filePath, destPath);
						newGr.Avatar = destPath.Substring(destPath.LastIndexOf('\\') + 1);
					}
					catch
					{
						; //Do nothing
					}
					_unitOfWork.Repository<Group>().Attach(newGr);
				}
			}
			await _unitOfWork.SaveAsync();
		}

		public async Task<GroupDto> EditGroup(int userId, int groupId, GroupDto group)
		{
			var editGroup = await _unitOfWork.Repository<Group>().GetAsync(groupId);

			if (editGroup.GroupCreator.Id != userId)
				return null;

			editGroup.Name = group.Name;
			editGroup.Description = group.Description;
			editGroup.Members.Clear();

			foreach (var memberId in group.SelectedMembersId)
				editGroup.Members.Add(await _unitOfWork.Repository<User>().GetAsync(memberId));

			_unitOfWork.Repository<Group>().Attach(editGroup);
			await _unitOfWork.SaveAsync();

			return GroupDto.FromModel(editGroup);
		}

		public async Task<bool> DeleteGroup(int userId, int groupId)
		{
			var group = await _unitOfWork.Repository<Group>().GetAsync(groupId);
			if (group != null)
			{
				if (group.GroupCreator.Id == userId)
				{
					_unitOfWork.Repository<Group>().Delete(group);
					await _unitOfWork.SaveAsync();
					return true;
				}
				else
					return false;
			}
			else
				return false;
		}
	}
}