using Joost.Api.Hubs;
using Joost.Api.Models;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public class ChatHubService : IChatHubService
    {
        private IUnitOfWork _unitOfWork;
        private IHubContext _hubContext;

        public ChatHubService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
        }

        public async Task SendToUser(MessageDto message)
        {
            using (var userRepository = _unitOfWork.Repository<User>())
            {
                var receiver = await userRepository.GetAsync(message.ReceiverId);
                if (receiver != null && !string.IsNullOrEmpty(receiver.ConnectionId))
                {
                    await _hubContext.Clients.Client(receiver.ConnectionId).addMessage();
                }
            }
        }

        public async Task SendToGroup(MessageDto message)
        {
            await _hubContext.Clients.Group(message.ReceiverId.ToString()).addMessage(message);
        }
    }
}