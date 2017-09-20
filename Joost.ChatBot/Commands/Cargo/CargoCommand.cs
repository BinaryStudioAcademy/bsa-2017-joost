using Joost.ChatBot.Commands.Cargo.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
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
                var sUrl = WebConfigurationManager.AppSettings["NovaPoshta_Site_Url"];
                var apiKey = WebConfigurationManager.AppSettings["NovaPoshta_Api_Key"];

                string jsonObject = "{\"apiKey\":\"" + apiKey + "\",\"modelName\": \"TrackingDocument\",\"calledMethod\":\"getStatusDocuments\",\"methodProperties\":{\"Documents\": [{\"DocumentNumber\": \"" + cargoId + "\",\"Phone\":\"\"}]}}";

                try
                {
                    using (var client = new HttpClient())
                    {
                        var contentJson = new StringContent(jsonObject.ToString(), Encoding.UTF8, "application/json");

                        using (var response = await client.PostAsync(sUrl, contentJson))
                        using (var content = response.Content)
                        {
                            var apiResponse = await content.ReadAsStringAsync();
                            var cargo = Convert(apiResponse);
                            if (cargo != null)
                                return CargoItemToHTMLString(cargo);
                            else
                                return "Error when creating an HTML code";
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
                return "Error occured when getting cargo info";
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

        public CargoItem Convert(string sResponse)
        {
            if (sResponse == null)
                return null;
            var cargo = JsonConvert.DeserializeObject<CargoItem>(sResponse);
            if (cargo == null)
                return null;
            return cargo;
        }

        public string CargoItemToHTMLString(CargoItem item)
        {
            if (item == null)
                return "An error occured";
            string resultHTML = String.Empty;

            if (item.success == true)
            {
                resultHTML += "<div class='bot-cargo-container'>";
                resultHTML += $"Status of your request: {item.data[0].Status}";
                if(item.data[0].StatusCode != "3") // Status code 3 == Cargo Id do not found
                {
                    resultHTML += $"Expected delivery date: {item.data[0].ScheduledDeliveryDate}";
                    resultHTML += $"Place of arrival: {item.data[0].WarehouseRecipient}";
                }
               
                resultHTML += "</div>";
            }
            else
            {
                resultHTML += "Can`t find your cargo";
            }
          
            return resultHTML;
        }
    }
}