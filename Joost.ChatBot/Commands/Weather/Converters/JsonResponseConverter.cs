using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Joost.ChatBot.Commands.Weather.Models;

namespace Joost.ChatBot.Commands.Weather.Converters
{
    public class JsonResponseConverter : IApiResponseConverter
    {
        public Models.Weather Convert(string sResponse)
        {
            if (sResponse == null)
                return null;
            var weather = JsonConvert.DeserializeObject<Models.OpenWeatherMapDTO.Weather>(sResponse);
            if (weather == null)
                return null;
            return OpenWeatherMapToWeather(weather);
        }

        public static DateTime TimeStampToDateTime(int javaTimeStamp)
        {
            // Java timestamp is milliseconds past epoch
            var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddMilliseconds(javaTimeStamp).ToLocalTime();
            return dtDateTime;
        }

        private static Models.Weather OpenWeatherMapToWeather(Models.OpenWeatherMapDTO.Weather w)
        {
            var weather = new Models.Weather
            {
                CityName = w.city.name,
                CountryCodeOfTheCity = w.city.country
            };
            foreach (var item in w.list)
                weather.WeatherList.Add(
                    new DailyForecast
                    {
                        Icon = $"{item.weather[0].id}{item.weather[0].icon.ElementAt(2)}.png",
                        Clouds = item.clouds,
                        Description = item.weather[0].description,
                        Humidity = item.humidity,
                        Pressure = item.pressure,
                        WindSpeed = item.speed,
                        DayTemp = item.temp.day,
                        MaxTemp = item.temp.max,
                        MinTemp = item.temp.min,
                        Time = TimeStampToDateTime(item.dt)
                    });
            return weather;
        }
    }
}