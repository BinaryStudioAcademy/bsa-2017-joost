using System;

namespace Joost.Api.Models
{
    public class RefreshTokenDto
    {
        public int UserId { get; set; }
        public DateTime Time { get; set; }
        public AccessTokenDto AccessToken { get; set; }
    }
}