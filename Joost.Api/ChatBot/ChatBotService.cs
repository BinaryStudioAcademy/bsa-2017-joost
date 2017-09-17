using Joost.Api.ChatBot.BotCommands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Joost.Api.Services;
using Joost.Api.Models;

namespace Joost.Api.ChatBot
{
	public class ChatBotService: IBotService
	{
		private List<IBotCommand> Commands { get; set; }

		IMessageService _messageService;

		public ChatBotService(IMessageService messageService)
		{
			Commands = new List<IBotCommand>();
			_messageService = messageService;
			Commands.Add(new TranslateCommand());
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


		public async Task Execute(MessageDto message)
		{
			var command = FindCommand(message.Text.Split(' ')[0]);
			if(command != null)
			{
				var str = await command.Execute(message.Text.Split(' '));
				if(str != null)
				{
					int res = message.ReceiverId;
					message.ReceiverId = message.SenderId;
					message.SenderId = res;
					message.Text = str;
					message.CreatedAt.AddSeconds(1);
					try
					{
						await _messageService.AddUserMessage(message);
					}
					catch(Exception ex)
					{
						throw ex;
					}
				}
			}

		}
	}
}