using Joost.Api.Models;
using System.Threading.Tasks;

namespace Joost.Api.Hubs
{
    public interface IClient
    {
        Task onConnected(UserStateDto userState);
        Task onNewUserConnected(UserStateDto userState);
        Task onUserDisconnected(UserStateDto userState);
        Task onAddMessage(MessageDto message);
        Task onNewUserInContacts(UserContactDto user);
		Task onNewGroupCreated(DialogDataDto group);
        Task onUserStateChange(UserStateDto userState);
        Task onContactAction(UserContactDto user);
        Task onNewGroupCreated(DialogDataDto group, UserDetailsDto creator);
    }
}
