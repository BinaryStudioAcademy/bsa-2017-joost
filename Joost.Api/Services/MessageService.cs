using System.Linq;
using System.Threading.Tasks;
using Joost.DbAccess.Interfaces;
using Joost.DbAccess.Entities;
using Joost.Api.Models;
using System.Data.Entity;
using System.Collections.Generic;
using Microsoft.Bot.Connector.DirectLine;
using System.Configuration;
using System;

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

        public async Task<IEnumerable<MessageDto>> GetUserMessages(int senderId, int receiverId, int skip, int take)
        {
            using (var messageRepository = _unitOfWork.Repository<Message>())
            {
				return await messageRepository
					.Query()
					.Include(m => m.Sender)
					.Include(m => m.Receiver)
					.Where(m => (m.Sender.Id == senderId && m.Receiver.Id == receiverId) ||
								(m.Sender.Id == receiverId && m.Receiver.Id == senderId))
					.OrderByDescending(m => m.CreatedAt)
					.Skip(skip)
					.Take(take)
					.OrderBy(m => m.CreatedAt)
					.Select(m => new MessageDto
					{
						Id = m.Id,
						SenderId = m.Sender.Id,
						ReceiverId = m.Receiver.Id,
						Text = m.Text,
						CreatedAt = m.CreatedAt,
						EditedAt = m.EditedAt,
						AttachedFile = m.AttachedFile,
						IsGroup = false
                    })
                    .ToListAsync();
            }
        }

        public async Task<IEnumerable<MessageDto>> GetGroupMessages(int senderId, int receiverId, int skip, int take)
        {
            using (var groupMessageRepository = _unitOfWork.Repository<GroupMessage>())
            {
				return await groupMessageRepository
					.Query()
					.Include(m => m.Receiver)
					.Where(m => m.Receiver.Id == receiverId)
					.OrderByDescending(m => m.CreatedAt)
					.Skip(skip)
					.Take(take)
					.OrderBy(m => m.CreatedAt)
					.Select(m => new MessageDto
					{
						Id = m.Id,
						SenderId = m.Sender.Id,
						ReceiverId = m.Receiver.Id,
						Text = m.Text,
						CreatedAt = m.CreatedAt,
						EditedAt = m.EditedAt,
						AttachedFile = m.AttachedFile,
						IsGroup = true
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
                    var sender = await userRepository
						.Query()
						.Include(s => s.Contacts)
						.FirstOrDefaultAsync(s => s.Id == message.SenderId);
                    if (sender != null)
                    {
						var receiver = sender.Contacts
							.Select(c => c.ContactUser)
							.Where(u => u.Id == message.ReceiverId)
							.FirstOrDefault();
                        if (receiver != null)
                        {
                            var newMessage = new Message
                            {
                                Sender = sender,
                                Receiver = receiver,
                                Text = message.Text,
                                CreatedAt = message.CreatedAt,
                                EditedAt = message.EditedAt,
                                AttachedFile = message.AttachedFile
                            };
                            _unitOfWork.Repository<Message>().Add(newMessage);
							message.Title = string.Format("{0} {1}", sender.FirstName, sender.LastName);
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
				using (var groupRepository = _unitOfWork.Repository<Group>())
				{
					var group = await groupRepository
						.Query()
						.Include(g => g.Members)
						.FirstOrDefaultAsync(g => g.Id == groupMessage.ReceiverId);
					if (group != null)
					{
						var sender = group.Members
							.Where(m => m.Id == groupMessage.SenderId)
							.FirstOrDefault();
						if (sender != null)
						{
							var newMessage = new GroupMessage
							{
								Sender = sender,
								Receiver = group,
								Text = groupMessage.Text,
								CreatedAt = groupMessage.CreatedAt,
								EditedAt = groupMessage.EditedAt,
								AttachedFile = groupMessage.AttachedFile
							};
							_unitOfWork.Repository<GroupMessage>().Add(newMessage);
							groupMessage.Title = string.Format("{0} {1}", sender.FirstName, sender.LastName);
							await _chatHubService.SendToGroup(groupMessage);
							await _unitOfWork.SaveAsync();
						}
					}
				}
			}
        }

        public async Task<bool> EditUserMessage(MessageDto message)
        {
            using (var messageRepository = _unitOfWork.Repository<Message>())
            {
                var mes = await messageRepository
					.Query()
					.Include(m => m.Sender)
					.FirstOrDefaultAsync(m => m.Id == message.Id);
                if (mes != null && mes.Sender.Id == message.SenderId)
                {
                    mes.Text = message.Text;
					mes.AttachedFile = message.AttachedFile;
                    mes.EditedAt = message.EditedAt;
                    messageRepository.Attach(mes);
                    await _unitOfWork.SaveAsync();
                    return true;
                }
                else return false;
            }
        }

        public async Task<bool> EditGroupMessage(MessageDto groupMessage)
        {
            using (var groupMessageRepository = _unitOfWork.Repository<GroupMessage>())
            {
                var gMes = await groupMessageRepository
					.Query()
					.Include(m => m.Sender)
					.FirstOrDefaultAsync(m => m.Id == groupMessage.Id);
                if (gMes != null && gMes.Sender.Id == groupMessage.SenderId)
                {
                    gMes.Text = groupMessage.Text;
					gMes.AttachedFile = groupMessage.AttachedFile;
                    gMes.EditedAt = groupMessage.EditedAt;
                    groupMessageRepository.Attach(gMes);
                    await _unitOfWork.SaveAsync();
                    return true;
                }
                else return false;
            }
        }

        public async Task<bool> DeleteUserMessage(int senderId, int messageId)
        {
            using (var messageRepository = _unitOfWork.Repository<Message>())
            {
                var message = await messageRepository
					.Query()
					.Include(m => m.Sender)
					.FirstOrDefaultAsync(m => m.Id == messageId);
				if (message != null && message.Sender.Id == senderId)
				{
					messageRepository.Delete(message);
					await _unitOfWork.SaveAsync();
					return true;
				}
				else return false;
            }
        }

        public async Task<bool> DeleteGroupMessage(int senderId, int groupMessageId)
        {
            using (var groupMessageRepository = _unitOfWork.Repository<Message>())
            {
                var groupMessage = await groupMessageRepository
					.Query()
					.Include(m => m.Sender)
					.FirstOrDefaultAsync(m => m.Id == groupMessageId);
				if (groupMessage != null && groupMessage.Sender.Id == senderId)
				{
					groupMessageRepository.Delete(groupMessage);
					await _unitOfWork.SaveAsync();
					return true;
				}
				else return false;
            }
        }


		private static int _chatBotIdInDb;
		private static string _botId;
		private static string _microsoftAppId;
		private static string _microsoftAppPassword;
		private static string _directLineSecret;
		//private static string _chatBotUri;

		private static DirectLineClient _client;
		private static Conversation _conversation;

		static MessageService()
		{
			int chatBotIdInDb;
			if (int.TryParse(ConfigurationManager.AppSettings["chatBotIdInDb"], out chatBotIdInDb))
				_chatBotIdInDb = chatBotIdInDb;
			else
				chatBotIdInDb = 1;
			_botId = ConfigurationManager.AppSettings["botId"];
			_microsoftAppId = ConfigurationManager.AppSettings["microsoftAppId"];
			_microsoftAppPassword = ConfigurationManager.AppSettings["microsoftAppPassword"];
			_directLineSecret = ConfigurationManager.AppSettings["directLineSecret"];
			//_chatBotUri = ConfigurationManager.AppSettings["chatBotUri"];

			StartConversation();
		}

		private static void StartConversation()
		{
			_client = new DirectLineClient(_directLineSecret);
			_client.BaseUri = new Uri("https://localhost:3979/api/chatbot/messages");
			_conversation = _client.Conversations.StartConversation();
		}

		public async Task<ResourceResponse> SendMessageToBot(MessageDto message)
		{
			Activity userMessage = new Activity
			{
				From = new ChannelAccount(message.SenderId.ToString()),
				Text = message.Text,
				Type = ActivityTypes.Message
			};
			return await _client.Conversations.PostActivityAsync(_conversation.ConversationId, userMessage);
		}
	}
}