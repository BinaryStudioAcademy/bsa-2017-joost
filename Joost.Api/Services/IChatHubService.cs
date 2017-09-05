using Joost.Api.Models;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public interface IChatHubService
    {
        Task SendToUser(MessageDto message);
        Task SendToGroup(MessageDto message);
		Task AddContact(int currentUserId, int contactUserId);
		Task AddGroup(int currentUserId);
    }
}
