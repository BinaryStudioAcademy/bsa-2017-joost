using Joost.DbAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.Api.Models
{
    public class UserStateDto
    {
        public int Id { get; set; }
        public UserState State { get; set; }
        public bool IsOnline { get; set; }
        public static UserStateDto FromModel(User model)
        {
            if (model == null)
                return null;
            else
                return new UserStateDto()
                {
                    Id = model.Id,
                    State = model.State,
                    IsOnline = model.IsOnline
                };
        }
    }
}