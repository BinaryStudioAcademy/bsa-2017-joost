using System.Threading.Tasks;

namespace Joost.Api.Hubs
{
    public interface IClient
    {
        Task onConnected(string connectionId, int userId);
        Task onNewUserConnected(string connectionId, int userId);
        Task onUserDisconnected(string connectionId, int userId);
        Task addMessage(int senderId, string message);
    }
}
