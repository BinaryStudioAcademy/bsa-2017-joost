using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Joost.ChatBot.LUIS;
using Joost.ChatBot.Commands;
using Ninject;
using Joost.ChatBot.Commands.Joke;

namespace Joost.ChatBot.Dialogs
{
	[Serializable]
	public class RootDialog : IDialog<object>
	{
		private readonly ICommandService _commandService;

		public RootDialog(ICommandService commandService)
		{
			_commandService = commandService;
		}

		public Task StartAsync(IDialogContext context)
		{
			context.Wait(MessageReceivedAsync);

			return Task.CompletedTask;
		}

		private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
		{
			var activity = await result as Activity;

			try
			{
				//var _luis = new LuisService();
				//var luis = await _luis.QueryLuis(activity.Text);
				//TakeTheJokeService joke = new TakeTheJokeService();
				string rez = await _commandService.Execute(activity.Text);
				await context.PostAsync(rez);
				context.Wait(MessageReceivedAsync);
			}
			catch(Exception ex)
			{
				throw ex;
			}
				// return our reply to the user

		}
	}
}