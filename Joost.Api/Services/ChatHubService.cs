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
                    await _hubContext.Clients.Client(receiver.ConnectionId).addMessage(message);
                }
            }
        }

        public async Task SendToGroup(MessageDto message)
        {
            await _hubContext.Clients.Group(message.ReceiverId.ToString()).addMessage(message);
        }

		public async Task AddContact(int currentUserId, int contactUserId)
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
						Id = contact.ContactUser.Id,
						State = (Models.ContactState)contact.State,
						Avatar = contact.ContactUser.Avatar,
						Name = contact.ContactUser.FirstName + " " + contact.ContactUser.LastName,
						City = contact.ContactUser.City
					};

					using (var userRepository = _unitOfWork.Repository<User>())
					{
						var contactUser = await userRepository
							.Query()
							.SingleOrDefaultAsync(u => u.Id == contactUserId);
						if (contactUser != null && !string.IsNullOrEmpty(contactUser.ConnectionId))
						{
							await _hubContext.Clients.Client(contactUser.ConnectionId).onNewUserInContacts(contactUserDto);

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
						var lastGroupDto = GroupDto.FromModel(lastGroup);
						var usersCId = lastGroup.Members.
						    Select(u => u.ConnectionId);
						var groupCreatorCId = lastGroup.GroupCreator.ConnectionId;
						foreach (var userCId in usersCId)
						{
							if (!string.IsNullOrEmpty(userCId) && userCId != groupCreatorCId)
								await _hubContext.Clients.Client(userCId).onNewGroupCreated(lastGroupDto);
						}
					}
				}
			}
		}
	}
}