using Joost.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public interface IMessageService
    {
        Task<IEnumerable<MessageDto>> GetUserMessages(int senderId, int receiverId, int skip, int take);
        Task<IEnumerable<MessageDto>> GetGroupMessages(int senderId, int receiverId, int skip, int take);
        Task<int> AddUserMessage(MessageDto message);
        Task<int> AddGroupMessage(MessageDto groupMessage);
        Task<bool> EditUserMessage(MessageDto message);
        Task<bool> EditGroupMessage(MessageDto groupMessage);
        Task<bool> DeleteUserMessage(int senderId, int messageId);
        Task<bool> DeleteGroupMessage(int senderId, int groupMessageId);
    }
}
