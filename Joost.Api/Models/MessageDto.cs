using Joost.DbAccess.Entities;
using System;

namespace Joost.Api.Models
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EditedAt { get; set; }
        public string AttachedFile { get; set; }

        public static MessageDto FromMessageModel(Message model)
        {
            if (model == null)
                return null;
            else
                return new MessageDto
                {
                    Id = model.Id,
                    SenderId = model.Sender.Id,
                    ReceiverId = model.Receiver.Id,
                    Text = model.Text,
                    CreatedAt = model.CreatedAt,
                    EditedAt = model.EditedAt,
                    AttachedFile = model.AttachedFile
                };
        }

        public static MessageDto FromGroupMessageModel(GroupMessage model)
        {
            if (model == null)
                return null;
            else
                return new MessageDto
                {
                    Id = model.Id,
                    SenderId = model.Sender.Id,
                    ReceiverId = model.Receiver.Id,
                    Text = model.Text,
                    CreatedAt = model.CreatedAt,
                    EditedAt = model.EditedAt,
                    AttachedFile = model.AttachedFile
                };
        }
    }
}