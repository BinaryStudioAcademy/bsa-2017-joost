using System.Threading.Tasks;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System.Linq;
using System.Data.Entity;
using Joost.Api.Models;
using System.Collections.Generic;

namespace Joost.Api.Services
{
    public class DialogDataService : IDialogDataService
    {
        private IUnitOfWork _unitOfWork;

        public DialogDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<Message> GetLastMessageInUserDialog(int userId)
        {
            return _unitOfWork.Repository<Message>()
                .Query()
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.Sender.Id == userId || m.Receiver.Id == userId)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public Task<GroupMessage> GetLastMessageInGroupDialog(int groupId)
        {
            return _unitOfWork.Repository<GroupMessage>()
                .Query()
                .Include(m => m.Receiver)
                .Where(m => m.Receiver.Id == groupId)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<DialogDataDto>> GetUserDialogsData(int userId)
        {
            var users = await _unitOfWork.Repository<Message>()
                .Query()
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.Sender.Id == userId || m.Receiver.Id == userId)
                .Select(m => m.Receiver.Id == userId ? m.Sender : m.Receiver)
                .Distinct()
                .ToListAsync();

            var dialogs = new List<DialogDataDto>();
            foreach (var item in users)
            {
                var lastMessage = await GetLastMessageInUserDialog(item.Id);
                dialogs.Add(new DialogDataDto
                {
                    Id = item.Id,
                    Name = item.FirstName,
                    LastMessage = lastMessage.Text,
                    DateLastMessage = lastMessage.CreatedAt,
                    Avatar = item.Avatar,
                    IsGroup = false,
                    IsOnline = item.IsOnline,
                    UserState = item.State
                });
            }
            return dialogs;
        }

        public async Task<IEnumerable<DialogDataDto>> GetGroupDialogsData(int userId)
        {
            var groups = await _unitOfWork.Repository<Group>()
                .Query()
                .Where(g => g.Members.Any(i => i.Id == userId) || g.GroupCreator.Id == userId)
                .ToListAsync();

            var dialogs = new List<DialogDataDto>();
            foreach (var item in groups)
            {
                var lastMessage = await GetLastMessageInGroupDialog(item.Id);
                dialogs.Add(new DialogDataDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    LastMessage = lastMessage == null ? "Group was created" : lastMessage.Text,
                    DateLastMessage = lastMessage == null ? item.CreatedAt : lastMessage.CreatedAt,
                    Avatar = item.Avatar,
                    IsGroup = true
                });
            }
            return dialogs;
        }
    }
}