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
        //public List<object> errors { get; set; }
        //public List<Warning> warnings { get; set; }
        //public List<object> info { get; set; }
        //public List<object> messageCodes { get; set; }
        //public List<object> errorCodes { get; set; }
        //public List<object> warningCodes { get; set; }
        //public List<object> infoCodes { get; set; }
    }

    //public class Warning
    //{
    //    public string ID_20400048799000 { get; set; }
    //}
}