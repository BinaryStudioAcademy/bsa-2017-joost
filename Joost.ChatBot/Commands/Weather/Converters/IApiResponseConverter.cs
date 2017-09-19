using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.ChatBot.Commands.Weather.Converters
{
    public interface IApiResponseConverter
    {
        Models.Weather Convert(string sResponse);
    }
}