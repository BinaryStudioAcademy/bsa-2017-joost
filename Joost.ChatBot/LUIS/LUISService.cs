using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace Joost.ChatBot.LUIS
{
    public class LUISService
    {
        private static async Task<LUIS> QueryLUIS(string Query)
        {
            LUIS LUISResult = new LUIS();

            var LUISQuery = Uri.EscapeDataString(Query);

            using (System.Net.Http.HttpClient client = new System.Net.Http.HttpClient())
            {
                // Get key values from the web.config

                string LUIS_Url = WebConfigurationManager.AppSettings["LUIS_Url"];

                string LUIS_Subscription_Key = WebConfigurationManager.AppSettings["LUIS_Subscription_Key"];

                string RequestURI = String.Format("{0}?subscription-key={1}&q={2}",

                    LUIS_Url, LUIS_Subscription_Key, LUISQuery);

                System.Net.Http.HttpResponseMessage msg = await client.GetAsync(RequestURI);

                if (msg.IsSuccessStatusCode)
                {
                    var JsonDataResponse = await msg.Content.ReadAsStringAsync();
                    LUISResult = JsonConvert.DeserializeObject<LUIS>(JsonDataResponse);
                }
            }

            return LUISResult;

        }

    }
}