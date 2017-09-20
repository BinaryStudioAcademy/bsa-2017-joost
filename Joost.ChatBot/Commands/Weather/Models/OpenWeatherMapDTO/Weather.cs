using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.ChatBot.Commands.Weather.Models.OpenWeatherMapDTO
{
    public class Weather
    {
        public City city { get; set; }
        public string cod { get; set; }
        public double message { get; set; }
        public int cnt { get; set; }
        public List<WeatherListItem> list { get; set; }
    }
}