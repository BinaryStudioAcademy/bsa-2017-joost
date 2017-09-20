using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.ChatBot.Commands.Cargo.Models
{
    public class CargoItem
    {
        public bool success { get; set; }
        public List<CargoData> data { get; set; }
    }
}