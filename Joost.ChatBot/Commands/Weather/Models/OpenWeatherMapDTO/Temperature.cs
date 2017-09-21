using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.ChatBot.Commands.Weather.Models.OpenWeatherMapDTO
{
    public class Temperature
    {
        public double day { get; set; }
        public double min { get; set; }
        public double max { get; set; }
        public double night { get; set; }
        public double eve { get; set; }
        public double morn { get; set; }
    }
}