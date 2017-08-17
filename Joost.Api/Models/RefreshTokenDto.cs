using System;

namespace Joost.Api.Models
{
    public class RefreshTokenDto
    {
        public int RT_UserId { get; set; }
        public DateTime RT_Time { get; set; }
        public AccessTokenDto RT_AccessToken { get; set; }
    }
}