using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Joost.ChatBot.Commands.Help
{
	[Serializable]
	public class HelpCommand : IBotCommand
	{
		private readonly IList<IBotCommand> _commands;

		public HelpCommand(IList<IBotCommand> commands)
		{
			_commands = commands;
		}

		public async Task<string> ExecuteAsync(string[] parameters)
		{
			string rez = "";
			foreach (IBotCommand cmd in _commands)
				rez += $"<div class=\"bot-command-header\">{cmd.GetCommand()}</div><div class=\"bot-command-description\">{cmd.GetDescription()}</div>";
			return rez;
		}

		public string GetCommand()
		{
			return "Help";
		}

		public string GetDescription()
		{
			return "List of things that i can help you with";
		}
	}
}