using System;
using System.Net.Http;
using System.Threading.Tasks;
using Joost.ChatBot.Commands.Weather.Converters;
using System.Configuration;

namespace Joost.ChatBot.Commands.Weather.Services
{
    public class OpenWeatherMapService : IWeatherService
    {
        private readonly IApiResponseConverter _converter;

        //Weather curWeather;
        public OpenWeatherMapService(IApiResponseConverter converter)
        {
            if (converter != null)
                _converter = converter;
            else throw new ArgumentNullException("Error when resolving interface IApiResponseConverter");
        }

        public async Task<string> GetWeatherByCityNameForPeriod(string name, string dayPeriod)
        {
            if (name == null)
                return null;
            int nDayPeriod;
            if (!int.TryParse(dayPeriod, out nDayPeriod))
                nDayPeriod = 1;
            var sUrl =
                $"http://api.openweathermap.org/data/2.5/forecast/daily?q={name}&type=accurate&units=metric&cnt={nDayPeriod}&APPID={ConfigurationManager.AppSettings["OpenWeatherMapApiKey"]}";
            try
            {
                using (var client = new HttpClient())
                using (var response = await client.GetAsync(sUrl))
                using (var content = response.Content)
                {
                    var apiResponse = await content.ReadAsStringAsync();
                    var weather =  _converter.Convert(apiResponse);
                    if (weather != null)
                        return WeatherToHTMLString(weather);
                    else
                        return "Error when creating an HTML code";
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string WeatherToHTMLString(Models.Weather w)
        {
            if (w == null)
                return "error";
            string resultHTML = String.Empty;

            resultHTML += $"<div class='bot-weather-container'>";
            resultHTML += $"<div class='bot-weather-city'>Weather in {w.CityName}</div>";
            foreach (var dailyForecast in w.WeatherList)
            {
                resultHTML += $"<div class='bot-weather-item-container'>";
                resultHTML += $"<div class='bot-weather-row'>";
                resultHTML += $"<div class='bot-weather-icon'> <img src='{dailyForecast.Icon}'/></div>";
                resultHTML += $"<div class='bot-weather-column'>";
                resultHTML += $"<div class='bot-weather-date'>{dailyForecast.Time}</div>";
                resultHTML += $"<div class='bot-weather-description'>{dailyForecast.Description}</div>";
                resultHTML += $"</div>";
                resultHTML += $"</div>";
                resultHTML += $"<div class='bot-weather-temperature-container'>";
                resultHTML += $"<div class='bot-weather-temperature-item'>Day: {dailyForecast.DayTemp}°</div>";
                resultHTML += $"<div class='bot-weather-temperature-item'>Min: {dailyForecast.MinTemp}°</div>";
                resultHTML += $"<div class='bot-weather-temperature-item'>Max: {dailyForecast.MaxTemp}°</div>";
                resultHTML += $"</div>";
                resultHTML += $"</div>";
            }
            resultHTML += $"</div>";

            return resultHTML;
        }
    }
}