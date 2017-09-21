using System.Collections.Generic;

namespace Joost.ChatBot.Commands.Weather.Models
{
    public class Weather
    {
        public Weather()
        {
            WeatherList = new List<DailyForecast>();
        }

        public string CityName { get; set; }
        public string CountryCodeOfTheCity { get; set; }
        public List<DailyForecast> WeatherList { get; set; }
    }
}