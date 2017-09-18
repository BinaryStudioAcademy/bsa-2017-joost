using Joost.Api.Hubs;
using Joost.Api.Models;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;

namespace Joost.Api.Services
{
	public class ChatHubService : IChatHubService
	{
		private IUnitOfWork _unitOfWork;
		private IHubContext<IClient> _hubContext;

		public ChatHubService(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_hubContext = GlobalHost.ConnectionManager.GetHubContext<ChatHub, IClient>();
		}

		public async Task SendToUser(MessageDto message)
		{
			using (var userRepository = _unitOfWork.Repository<User>())
			{
				var receiver = await userRepository.GetAsync(message.ReceiverId);
				if (receiver != null && !string.IsNullOrEmpty(receiver.ConnectionId))
				{
					await _hubContext.Clients.Client(receiver.ConnectionId).onAddMessage(message);
				}
			}
		}

        public async Task DeleteUserMessage(MessageDto message)
        {
            using (var userRepository = _unitOfWork.Repository<User>())
            {
                var receiver = await userRepository.GetAsync(message.ReceiverId);
                if (receiver != null && !string.IsNullOrEmpty(receiver.ConnectionId))
                {
                    await _hubContext.Clients.Client(receiver.ConnectionId).onDeleteMessage(message.Id);
                }
            }
        }

        public async Task DeleteGroupMessage(MessageDto message)
        {
            await _hubContext.Clients.Group(message.ReceiverId.ToString()).onDeleteMessage(message.Id);
        }

        public async Task SendToGroup(MessageDto message)
		{
			await _hubContext.Clients.Group(message.ReceiverId.ToString()).onAddMessage(message);
		}

        public async Task ChangeUserState(User user, string connectionId)
        {
            await _hubContext.Clients.AllExcept(connectionId).onUserStateChange(UserStateDto.FromModel(user));
        }

        public async Task RunContactAction(int currentUserId, int contactUserId, ContactState state)
		{
			using (var contactRepository = _unitOfWork.Repository<Contact>())
			{
				var contact = await contactRepository
					.Query()
					.Include(c => c.User)
					.Include(c => c.ContactUser)
					.SingleOrDefaultAsync(c => c.User.Id == currentUserId && c.ContactUser.Id == contactUserId);
				if (contact != null)
				{
					var contactUserDto = new UserContactDto
					{
						Id = currentUserId,
						State = state,
						Avatar = contact.User.Avatar,
						Name = contact.User.FirstName + " " + contact.User.LastName,
						City = contact.User.City,
                        UserState = contact.User.State,
                        IsOnline = contact.User.IsOnline
					};

					using (var userRepository = _unitOfWork.Repository<User>())
					{
						var contactUser = await userRepository
							.Query()
							.SingleOrDefaultAsync(u => u.Id == contactUserId);
						if (contactUser != null && !string.IsNullOrEmpty(contactUser.ConnectionId))
						{
							await _hubContext.Clients.Client(contactUser.ConnectionId).onContactAction(contactUserDto);
						}
					}
				}
			}
		}

		public async Task AddGroup(int currentUserId)
		{
			using (var userRepository = _unitOfWork.Repository<User>())
			{
				var currentUser = await userRepository
					.Query()
					.Include(u => u.Groups)
					.SingleOrDefaultAsync(u => u.Id == currentUserId);
				if (currentUser != null)
				{
					var lastGroup = currentUser.Groups
						.OrderByDescending(g => g.CreatedAt)
						.FirstOrDefault();
					if (lastGroup != null)
					{
						var lastMessage = await GetLastMessageInGroupDialog(lastGroup.Id);
						var groupDialog = new DialogDataDto
						{
							Id = lastGroup.Id,
							Name = lastGroup.Name,
							LastMessage = lastMessage != null ? lastMessage.Text: null,
							DateLastMessage = lastMessage != null ? lastMessage.CreatedAt: new System.DateTime(),
							Avatar = lastGroup.Avatar,
							IsGroup = true
						};
						var usersCId = lastGroup.Members.
							Select(u => u.ConnectionId);
						var groupCreatorCId = lastGroup.GroupCreator.ConnectionId;
						foreach (var userCId in usersCId)
						{
							if (!string.IsNullOrEmpty(userCId) && userCId != groupCreatorCId)
								await _hubContext.Clients.Client(userCId).onNewGroupCreated(groupDialog, UserDetailsDto.FromModel(currentUser));
						}
					}
				}
			}
		}

		private Task<GroupMessage> GetLastMessageInGroupDialog(int groupId)
		{
			return _unitOfWork.Repository<GroupMessage>()
				.Query()
				.Include(m => m.Receiver)
				.Where(m => m.Receiver.Id == groupId)
				.OrderByDescending(m => m.CreatedAt)
				.FirstOrDefaultAsync();
		}
	}
}