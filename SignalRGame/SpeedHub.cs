using DataAnnotationsExtensions;
using Microsoft.AspNetCore.SignalR;

namespace Scrumbs.SignalRGame
{
    public class SpeedHub: Hub
    {
        public async Task PlayCard(string user, string group, Card card, CancellationToken cancellationToken){ 
            await Clients.OthersInGroup(group).SendAsync("MoveHandler", user, "GameState",cancellationToken);
        }

        public async Task NewGroup()
        {
        }
    }
    public class Card
    {
        public Suite Suite { get; set; }
        [Min(1)]
        [Max(13)]
        public int SuiteNumber { get; set; }
        public House House { get; set; }
    }
    public enum House
    {
        Heart,
        Spade,
        Club,
        Diamond
    }
    public enum Suite
    {
        Ace = 1,
        Two = 2,
        Three = 3,
        Four = 4,
        Five = 5,
        Six = 6,
        Seven = 7,
        Eight = 8,
        Nine = 9,
        Ten = 10,
        Jack = 11,
        Queen = 12,
        King = 13,
    }
}
