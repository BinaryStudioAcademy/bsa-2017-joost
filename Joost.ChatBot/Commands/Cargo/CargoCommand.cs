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
                                return null;
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
                return null;
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
                return null;
            string resultHTML = string.Empty;

			if (item.success == true)
			{
				resultHTML += "<div class='bot-cargo-container'>";
				resultHTML += $"<div class='bot-cargo-item'><div>Status of your request:</div><div>{item.data[0].Status}</div></div>";
				if (!string.IsNullOrEmpty(item.data[0].ScheduledDeliveryDate))
					resultHTML += $"<div class='bot-cargo-item'><div>Expected delivery date:</div><div>{item.data[0].ScheduledDeliveryDate}</div></div>";
				if (!string.IsNullOrEmpty(item.data[0].WarehouseRecipient))
					resultHTML += $"<div class='bot-cargo-item'><div>Place of arrival:</div><div>{item.data[0].WarehouseRecipient}</div></div>";
				resultHTML += "</div>";
			}
			else
            {
                resultHTML += "Can`t find your cargo. Please, check it's id";
            }
          
            return resultHTML;
        }
    }
}