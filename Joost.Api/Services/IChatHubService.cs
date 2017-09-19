using Joost.Api.Models;
using Joost.DbAccess.Entities;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public interface IChatHubService
    {
        Task SendToUser(MessageDto message);
        Task DeleteUserMessage(MessageDto message);
        Task DeleteGroupMessage(MessageDto message);
        Task SendToGroup(MessageDto message);
		Task RunContactAction(int currentUserId, int contactUserId, ContactState state);
		Task AddGroup(int currentUserId);
        Task ChangeUserState(User user, string connectionId);
    }
}
