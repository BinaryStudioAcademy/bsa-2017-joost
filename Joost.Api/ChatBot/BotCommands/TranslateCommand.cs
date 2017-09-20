using Google.Apis.Services;
using Google.Apis.Translate.v2;
using Google.Apis.Translate.v2.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Joost.Api.ChatBot.BotCommands
{
	public class TranslateCommand : IBotCommand
	{
		const string _api = "AIzaSyC_TdnSHiwddJ2SbLxp4iC9E9vCciCQIXQ";
		private TranslateService _service;

		public TranslateCommand()
		{
			_service = new TranslateService(new BaseClientService.Initializer()
			{
				ApiKey = _api,
				ApplicationName = "Joost API"
			});
		}

		public async Task<string> Execute(string[] parameters)
		{
			if (parameters.Length >= 3)
			{
				try
				{
					var service = new TranslateService(new BaseClientService.Initializer()
					{
						ApiKey = _api,
						ApplicationName = "Translate API Sample"
					});

					string[] srcText = new[] { parameters[2] };
					var response = await service.Translations.List(srcText, parameters[1]).ExecuteAsync();
					var translations = new List<string>();

					foreach (var translation in response.Translations)
					{
						translations.Add(translation.TranslatedText);
						
					}

					// Translate the text (back) to English.


					return translations[0];
				}
				catch(Exception ex)
				{
					throw ex;
				}
				
			}
			else
				return null;
		}

		public string GetCommand()
		{
			return "/translate";
		}

		public string GetDescription()
		{
			return "/translate [lanID] \"[Text]\"";
		}
	}
}