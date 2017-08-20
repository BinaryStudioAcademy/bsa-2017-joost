using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.Api.Models
{
    public class MessageDto
    {
        public string Sender { get; set; }

        public string SenderId { get; set; }

        public string Text { get; set; }

        public DateTime DateTime { get; set; }

        public string Image { get; set; }
    }
}