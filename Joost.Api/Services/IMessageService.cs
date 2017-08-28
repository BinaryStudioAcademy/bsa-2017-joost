using Joost.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public interface IMessageService
    {
        Task<IEnumerable<MessageDto>> GetUserMessages(int userId, int skip, int take);
        Task<IEnumerable<MessageDto>> GetGroupMessages(int groupId, int skip, int take);
        Task AddUserMessage(MessageDto message);
        Task AddGroupMessage(MessageDto groupMessage);
        Task<MessageDto> EditUserMessage(int messageId, string newText, DateTime editedAt);
        Task<MessageDto> EditGroupMessage(int groupMessageId, string newText, DateTime editedAt);
        Task DeleteUserMessage(int messageId);
        Task DeleteGroupMessage(int groupMessageId);
    }
}
