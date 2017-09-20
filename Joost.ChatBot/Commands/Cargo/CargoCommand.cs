using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace Joost.ChatBot.Commands.Cargo
{
    [Serializable]
    public class CargoCommand : IBotCommand
    {
        public async Task<string> ExecuteAsync(string[] parameters)
        {
            if (parameters != null || parameters.Length >= 1)
            {
                string cargoId = parameters[0];
                var sUrl = WebConfigurationManager.AppSettings["NovaPoshta_Api_Key"];
                try
                {
                    using (var client = new HttpClient())
                    {
                        client.DefaultRequestHeaders.Add("Accept", "text/plain");
                        using (var response = await client.GetAsync(sUrl))
                        using (var content = response.Content)
                        {
                            var apiResponse = await content.ReadAsStringAsync();
                            return apiResponse;
                        }
                    }
                }
                catch (Exception)
                {
                    return null;
                }
            }
            else
            {
                return "Error occured when cargo info";
            }
        }

        public string GetCommand()
        {
            return "Cargo";
        }

        public string GetDescription()
        {
            return "I have some friends at NovaPoshta. Just ask me if you need to track your cargo";
        }
    }
}