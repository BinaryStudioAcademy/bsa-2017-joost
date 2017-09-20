using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace Joost.ChatBot.Commands.Joke
{
	[Serializable]
	public class TakeTheJokeCommand : IBotCommand
	{
		public async Task<string> ExecuteAsync(string[] parameters)
		{
			var sUrl = WebConfigurationManager.AppSettings["Joke_site_url"];
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

		public string GetCommand()
		{
			return "Joke";
		}

		public string GetDescription()
		{
			return "You can ask me for a joke or funny story if you are bored ;)";
		}
	}
}