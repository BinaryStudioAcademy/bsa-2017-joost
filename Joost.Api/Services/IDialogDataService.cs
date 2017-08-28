using Joost.Api.Models;
using Joost.DbAccess.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Joost.Api.Services
{
    public interface IDialogDataService
    {
        Task<Message> GetLastMessageInUserDialog(int userId);
        Task<GroupMessage> GetLastMessageInGroupDialog(int groupId);
        Task<IEnumerable<DialogDataDto>> GetUserDialogsData(int userId);
        Task<IEnumerable<DialogDataDto>> GetGroupDialogsData(int userId);
    }
}
