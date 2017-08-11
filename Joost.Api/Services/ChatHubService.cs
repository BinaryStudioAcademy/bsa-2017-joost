using Joost.Api.Hubs;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public class ChatHubService : IChatHubService
    {
        private IHubContext _hubContext;
        private IUnitOfWork _unitOfWork;

        public ChatHubService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
        }

        public async Task SendToUser(int senderId, int receiverId, string message)
        {
            using (var userRepository = _unitOfWork.Repository<User>())
            {
                var receiver = await userRepository.GetAsync(receiverId);
                if (receiver != null && !string.IsNullOrEmpty(receiver.ConnectionId))
                {
                    await _hubContext.Clients.Client(receiver.ConnectionId).addMessage(senderId, message);
                }
            }
        }
        public async Task SendToGroup(int senderId, int groupId, string message)
        {
            await _hubContext.Clients.Group(groupId.ToString()).addMessage(senderId, message);
        }
    }
}