using System;
using Joost.ChatBot.Commands.Joke;
using Joost.ChatBot.LUIS;
using System.Collections.Generic;
using System.Threading.Tasks;
using Joost.ChatBot.Commands.Help;

namespace Joost.ChatBot.Commands
{
	[Serializable]
	public class CommandService : ICommandService
	{
		private List<IBotCommand> Commands { get; set; }
		private ILuisService _luis;
		public CommandService(ILuisService luis)
		{
			_luis = luis;

			Commands = new List<IBotCommand>()
			{
				new TakeTheJokeCommand()
			};
			var helpCmd = new HelpCommand(Commands);

			Commands.Add(helpCmd);
		}


		private IBotCommand FindCommand(string command)
		{
			foreach (var cmd in Commands)
			{
				if (cmd.GetCommand() == command)
					return cmd;
			}
			return null;
		}


		public async Task<string> Execute(string query)
		{
			var luis = await _luis.QueryLuis(query);

			var cmd = FindCommand(luis.topScoringIntent.intent);

			return await cmd.Execute(null);
		}
	}
}