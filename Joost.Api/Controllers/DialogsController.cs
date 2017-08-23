using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    using System.Data.Entity;
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
            var currentUserId = this.GetCurrentUserId();
            var messages = this._unitOfWork.Repository<Message>().Query();
            var usersDialogs = messages
                .Include(m => m.Receiver)
                .Include(m => m.Sender)
                .Where(m => m.Receiver.Id == currentUserId || m.Sender.Id == currentUserId)
                .ToArray()
                .Aggregate(
                    new List<User>(),
                    (list, message) =>
                        {
                            if (message.Receiver.Id == currentUserId)
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
            var groups = this._unitOfWork.Repository<Group>().Query();
            var groupDialogs = groups.Where(item => item.Members.Any(i => i.Id == currentUserId)).ToArray().Select(
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
            var currentUserId = this.GetCurrentUserId();
            var messagesWith = this._unitOfWork.Repository<Message>().Query();
            return messagesWith
                .Where(m => m.Sender.Id == currentUserId || m.Receiver.Id == currentUserId)
                .Where(m => m.Sender.Id == id || m.Receiver.Id == id).OrderByDescending(m => m.CreatedAt).First();
        }

        private async Task<GroupMessage> LastMessageInGroupDialog(int groupId)
        {
            var messages = this._unitOfWork.Repository<GroupMessage>().Query();
            return messages.Where(m => m.Receiver.Id == groupId).OrderByDescending(m => m.CreatedAt).First();
        }
    }
}
