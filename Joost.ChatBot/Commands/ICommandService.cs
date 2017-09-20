using System.Threading.Tasks;

namespace Joost.ChatBot.Commands
{
	public interface ICommandService
	{
		Task<string> Execute(string mssage);
	}
}
