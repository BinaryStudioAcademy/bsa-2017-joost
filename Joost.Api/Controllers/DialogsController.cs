using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    using System.Threading.Tasks;

    using Joost.Api.Models;
    using Joost.DbAccess.Entities;
    using Joost.DbAccess.Interfaces;

    public class DialogsController : BaseApiController
    {
        public DialogsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        { }

        [HttpGet]
        public async Task<IHttpActionResult> GetDialogs()
        {
            var messages = await this._unitOfWork.Repository<Message>().AllAsync();
            var usersDialogs = messages
                .Where(m => m.Receiver.Id == this.GetCurrentUserId() || m.Sender.Id == this.GetCurrentUserId())
                .Aggregate(
                    new List<User>(),
                    (list, message) =>
                        {
                            if (message.Receiver.Id == this.GetCurrentUserId())
                            {
                                if (!list.Contains(message.Sender))
                                {
                                    list.Add(message.Sender);
                                }
                            }
                            else
                            {
                                if (!list.Contains(message.Receiver))
                                {
                                    list.Add(message.Receiver);
                                }
                            }
                            return list;
                        }).Select(
                    async u => new Dialog
                                   {
                                       Id = u.Id.ToString(),
                                       Image = u.Avatar,
                                       IsGroup = false,
                                       LastMessage = (await LastMessageInUsersDialog(u.Id)).Text,
                                       Name = u.FirstName
                                   });
            var groups = await this._unitOfWork.Repository<Group>().AllAsync();
            var groupDialogs = groups.Where(item => item.Members.Any(i => i.Id == this.GetCurrentUserId())).Select(
                async g => new Dialog
                               {
                                   Id = g.Id.ToString(),
                                   Image = string.Empty,
                                   LastMessage = (await LastMessageInGroupDialog(g.Id)).Text,
                                   Name = g.Name,
                                   IsGroup = true
                               });
            var enumerable = usersDialogs.Union(groupDialogs).Select(t => t.Result);
            return this.Ok(enumerable);
        }

        private async Task<Message> LastMessageInUsersDialog(int id)
        {
            var messagesWith = await this._unitOfWork.Repository<Message>().AllAsync();
            return messagesWith
                .Where(m => m.Sender.Id == this.GetCurrentUserId() || m.Receiver.Id == this.GetCurrentUserId())
                .Where(m => m.Sender.Id == id || m.Receiver.Id == id).OrderByDescending(m => m.CreatedAt).First();
        }

        private async Task<GroupMessage> LastMessageInGroupDialog(int groupId)
        {
            var messages = await this._unitOfWork.Repository<GroupMessage>().AllAsync();
            return messages.Where(m => m.Receiver.Id == groupId).OrderByDescending(m => m.CreatedAt).First();
        }
    }
}
