using System;

namespace Joost.Api.Models
{
    public class DialogDataDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastMessage { get; set; }
        public DateTime DateLastMessage { get; set; }
        public string Avatar { get; set; }
        public bool IsGroup { get; set; }
    }
}