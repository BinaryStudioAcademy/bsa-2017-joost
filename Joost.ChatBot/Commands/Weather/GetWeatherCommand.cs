using Joost.ChatBot.Commands.Weather.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Joost.ChatBot.Commands.Weather
{
    [Serializable]
    public class GetWeatherCommand : IBotCommand
    {
        IWeatherService _weatherService;

        public GetWeatherCommand(IWeatherService weatherService)
        {
            this._weatherService = weatherService;
        }

        public async Task<string> Execute(string[] parameters)
        {
            if (parameters != null)
            {
                string city = parameters[0];
                string period = parameters[1];

                string result = await _weatherService.GetWeatherByCityNameForPeriod(city, period);
                return result;
            }
            else
            {
                return "Error occured when getting weather forecast";
            }
        }

        public string GetCommand()
        {
            return "Weather";
        }

        public string GetDescription()
        {
            return "If you need weather forecast you can just ask me for that by writing something like that: 'Weather in Lviv' or 'Weather in Kyiv for 3 days'";
        }
    }
}