using Joost.Api.Models;
using System.Threading.Tasks;

namespace Joost.Api.ChatBot
{
	public interface IBotService
	{
		Task Execute(MessageDto message);
	}
}
