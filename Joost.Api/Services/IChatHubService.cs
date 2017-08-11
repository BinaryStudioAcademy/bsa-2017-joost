using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public interface IChatHubService
    {
        Task SendToUser(int senderId, int receiverId, string message);
        Task SendToGroup(int senderId, int groupId, string message);
    }
}
