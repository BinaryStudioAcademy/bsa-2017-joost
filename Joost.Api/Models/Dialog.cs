using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.Api.Models
{
    public class Dialog
    {
        public string Name { get; set; }

        public string LastMessage { get; set; }

        public string Image { get; set; }

        public bool IsGroup { get; set; }

        public string Id { get; set; }
    }
}