using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Joost.ChatBot.Commands.Weather.Services
{
    public interface IWeatherService
    {
        Task<string> GetWeatherByCityNameForPeriod(string name, string dayPeriod);
    }
}