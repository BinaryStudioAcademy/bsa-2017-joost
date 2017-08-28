using System;
using System.Linq;
using System.Threading.Tasks;
using Joost.DbAccess.Interfaces;
using Joost.DbAccess.Entities;
using Joost.Api.Models;
using System.Data.Entity;
using System.Collections.Generic;

namespace Joost.Api.Services
{
    public class MessageService: IMessageService
    {
        private IUnitOfWork _unitOfWork;
        private IChatHubService _chatHubService;

        public MessageService(IUnitOfWork unitOfWork, IChatHubService chatHubService)
        {
            _unitOfWork = unitOfWork;
            _chatHubService = chatHubService;
        }

        public async Task<IEnumerable<MessageDto>> GetUserMessages(int userId, int skip, int take)
        {
            using (var messageRepository = _unitOfWork.Repository<Message>())
            {
                return await messageRepository
                    .Query()
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .Where(m => m.Sender.Id == userId || m.Receiver.Id == userId)
                    .OrderBy(m => m.CreatedAt)
                    .Skip(skip)
                    .Take(take)
                    .Select(m => new MessageDto
                    {
                        Id = m.Id,
                        SenderId = m.Sender.Id,
                        ReceiverId = m.Receiver.Id,
                        Text = m.Text,
                        CreatedAt = m.CreatedAt,
                        EditedAt = m.EditedAt
                    })
                    .ToListAsync();
            }
        }

        public async Task<IEnumerable<MessageDto>> GetGroupMessages(int groupId, int skip, int take)
        {
            using (var groupMessageRepository = _unitOfWork.Repository<GroupMessage>())
            {
                return await groupMessageRepository
                    .Query()
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .Where(m => m.Receiver.Id == groupId)
                    .OrderBy(m => m.CreatedAt)
                    .Skip(skip)
                    .Take(take)
                    .Select(m => new MessageDto
                    {
                        Id = m.Id,
                        SenderId = m.Sender.Id,
                        ReceiverId = m.Receiver.Id,
                        Text = m.Text,
                        CreatedAt = m.CreatedAt,
                        EditedAt = m.EditedAt
                    })
                    .ToListAsync();
            }
        }

        public async Task AddUserMessage(MessageDto message)
        {
            if (message != null)
            {
                using (var userRepository = _unitOfWork.Repository<User>())
                {
                    var sender = await userRepository.FindAsync(s => s.Id == message.SenderId);
                    if (sender != null)
                    {
                        var receiver = await _unitOfWork.Repository<User>().FindAsync(s => s.Id == message.ReceiverId);
                        if (receiver != null)
                        {
                            var newMessage = new Message
                            {
                                Sender = sender,
                                Receiver = receiver,
                                Text = message.Text,
                                CreatedAt = message.CreatedAt,
                                EditedAt = message.EditedAt
                            };
                            _unitOfWork.Repository<Message>().Add(newMessage);
                            await _chatHubService.SendToUser(message);
                            await _unitOfWork.SaveAsync();
                        }
                    }
                }
            }
        }

        public async Task AddGroupMessage(MessageDto groupMessage)
        {
            if (groupMessage != null)
            {
                var sender = await _unitOfWork.Repository<User>().FindAsync(s => s.Id == groupMessage.SenderId);
                if (sender != null)
                {
                    var receiver = await _unitOfWork.Repository<Group>().FindAsync(s => s.Id == groupMessage.ReceiverId);
                    if (receiver != null)
                    {
                        var newMessage = new GroupMessage
                        {
                            Sender = sender,
                            Receiver = receiver,
                            Text = groupMessage.Text,
                            CreatedAt = groupMessage.CreatedAt,
                            EditedAt = groupMessage.EditedAt
                        };
                        _unitOfWork.Repository<GroupMessage>().Add(newMessage);
                        await _chatHubService.SendToGroup(groupMessage);
                        await _unitOfWork.SaveAsync();
                    }
                }
            }
        }

        public async Task<MessageDto> EditUserMessage(int messageId, string newText, DateTime editedAt)
        {
            using (var messageRepository = _unitOfWork.Repository<Message>())
            {
                var message = await messageRepository.FindAsync(m => m.Id == messageId);
                if (message != null)
                {
                    message.Text = newText;
                    message.EditedAt = editedAt;
                    messageRepository.Attach(message);
                    await _unitOfWork.SaveAsync();
                }
                return new MessageDto()
                {
                    Id = message.Id,
                    SenderId = message.Sender.Id,
                    ReceiverId = message.Receiver.Id,
                    Text = message.Text,
                    CreatedAt = message.CreatedAt,
                    EditedAt = message.EditedAt
                };
            }
        }

        public async Task<MessageDto> EditGroupMessage(int groupMessageId, string newText, DateTime editedAt)
        {
            using (var groupMessageRepository = _unitOfWork.Repository<GroupMessage>())
            {
                var groupMessage = await groupMessageRepository.FindAsync(m => m.Id == groupMessageId);
                if (groupMessage != null)
                {
                    groupMessage.Text = newText;
                    groupMessage.EditedAt = editedAt;
                    groupMessageRepository.Attach(groupMessage);
                    await _unitOfWork.SaveAsync();
                }
                return new MessageDto()
                {
                    Id = groupMessage.Id,
                    SenderId = groupMessage.Sender.Id,
                    ReceiverId = groupMessage.Receiver.Id,
                    Text = groupMessage.Text,
                    CreatedAt = groupMessage.CreatedAt,
                    EditedAt = groupMessage.EditedAt
                };
            }
        }

        public async Task DeleteUserMessage(int messageId)
        {
            using (var messageRepository = _unitOfWork.Repository<Message>())
            {
                var message = await messageRepository.FindAsync(item => item.Id == messageId);
                if (message != null)
                {
                    messageRepository.Delete(message);
                    await _unitOfWork.SaveAsync();
                }
            }
        }

        public async Task DeleteGroupMessage(int groupMessageId)
        {
            using (var groupMessageRepository = _unitOfWork.Repository<Message>())
            {
                var groupMessage = await groupMessageRepository.FindAsync(item => item.Id == groupMessageId);
                if (groupMessage != null)
                {
                    groupMessageRepository.Delete(groupMessage);
                    await _unitOfWork.SaveAsync();
                }
            }
        }
    }
}