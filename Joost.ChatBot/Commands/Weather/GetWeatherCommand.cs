using Joost.ChatBot.Commands.Weather.Models;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Configuration;

namespace Joost.ChatBot.Commands.Weather
{
	[Serializable]
	public class GetWeatherCommand : IBotCommand
	{
		public async Task<string> ExecuteAsync(string[] parameters)
		{
			if (parameters != null || parameters.Length >= 1)
			{
				string city = parameters[0];
				string period = (parameters.Length >= 2) ? parameters[1] : "1";

				string result = await GetWeatherByCityNameForPeriod(city, period);
				return result;
			}
			else
			{
				return "Error occured when getting weather forecast";
			}
		}

		public string GetCommand()
		{
			return "GetWeather";
		}

		public string GetDescription()
		{
			return "If you need weather forecast you can just ask me for it by writing something like that: 'Weather in Lviv' or 'Weather in Kyiv for 3 days'";
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
					var weather = Convert(apiResponse);
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
			resultHTML += $"<div class='bot-weather-items-container'>";
			foreach (var dailyForecast in w.WeatherList)
			{
				resultHTML += $"<div class='bot-weather-item-container'>";
				resultHTML += $"<div class='bot-weather-date'>{dailyForecast.Time.ToString("m")}</div>";
				resultHTML += $"<div class='bot-weather-row'>";
				resultHTML += $"<div class='bot-weather-icon'> <img src='assets/img/WeatherIcons/{dailyForecast.Icon}'/></div>";
				resultHTML += $"<div class='bot-weather-main-info-container'>";
				resultHTML += $"<div class='bot-weather-description'>{dailyForecast.Description}</div>";

				resultHTML += $"<div class='bot-weather-temperature-container'>";
				resultHTML += $"<div class='bot-weather-column'>";

				resultHTML += $"<div class='bot-weather-temperature-item'><div>Day:</div><div>{dailyForecast.DayTemp}°</div>";
				resultHTML += $"</div>";

				resultHTML += $"<div class='bot-weather-temperature-item'><div>Min:</div><div>{dailyForecast.MinTemp}°</div>";
				resultHTML += $"</div>";

				resultHTML += $"<div class='bot-weather-temperature-item'><div>Max:</div><div>{dailyForecast.MaxTemp}°</div>";
				resultHTML += $"</div>";

				resultHTML += $"</div>";

				resultHTML += $"</div>";
				resultHTML += $"</div>";
				resultHTML += $"</div>";
			}
			resultHTML += $"</div>";
			resultHTML += $"</div>";
			return resultHTML;

		}

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