module.exports = {
    args: true,
    guildOnly: true,
    botpermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    category: 'Fun',
    name: 'tictactoe',
    description: 'Play the classic game tictactoe with a user by mentioning them!',
    aliases: ['ttt'],
    usage: '<@user>',
    example: [
        'tictactoe @testUser#1234'
    ],
    cooldown: 30,
	async execute(message, args, bot) {
        const reactions = {"1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7, "8️⃣": 8, "9️⃣": 9 };
        const width = 3;
        const height = 3;
        const gameBoard = [];
        var str = "";
        var userTurn;
        //*Updating the board
        function drawBoard() {
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    str += "|" + gameBoard[i * width + j];
                };
                str += "|\n";
            };
        };
        //*Filtering users
        function filter(reaction, user) {
            return Object.keys(reactions).includes(reaction.emoji.name) && user.id === userTurn.id;
        };

        //?WIN CHECK
        function winCheck(gameBoard, sign) {
            const combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];  
            var result = 0;
            for(var i = 0; i < combos.length; i++){
                result = 0;
                for(var j = 0; j < combos[i].length; j++){
                    var position = combos[i][j];
                    if(gameBoard[position] === sign) {
                        result++;
                    } else {
                        result = 0;
                    };
                    if(result == 3) return true;
                };
            };
            return false;
        };

        //? Check if tie
        function isBoardFull() {
            for (let i = 0; i < height; i++)
                for (let j = 0; j < width; j++)
                    if (gameBoard[i * height + j] === '⬜')
                        return false;
            return true;
        };

        //!EXECUTION
        if(message.mentions.members.first()) {
        if(message.mentions.members.first().id == message.author.id) return message.reply('you can\'t play with yourself, silly');
        if(message.mentions.members.first().user.bot) return message.reply('you can\'t play with a bot');
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    gameBoard[i * width + j] = '⬜';
                };
            };
            drawBoard();
            userTurn = message.author;
            const msg = await message.channel.send(`${userTurn} Your turn! \n${str}`);
            Object.keys(reactions).forEach(reaction => {
                msg.react(reaction);
            });
            waitforReaction();

            function sendBoard() {
                str = '';
                if(winCheck(gameBoard, userTurn.id === message.author.id ? '🅾️' : '❎')) {
                    drawBoard();
                    userTurn.id === message.author.id ? userTurn = message.mentions.members.first() : userTurn = message.author;
                    return gameOver(userTurn, str);
                } else if(isBoardFull()) {
                    drawBoard();
                    return gameOver('tie', str);
                } else {
                    drawBoard();
                    msg.edit(`${userTurn} Your turn!\n${str}`);
                    waitforReaction();    
                }; 
            };
            function waitforReaction() {
                msg.awaitReactions((reaction, user) => filter(reaction, user), { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    if(gameBoard[reactions[reaction.emoji.name] - 1] === '⬜') {
                        msg.reactions.cache.get(reaction.emoji.name).remove();
                        userTurn === message.author ? gameBoard[reactions[reaction.emoji.name] - 1] = '❎' : gameBoard[reactions[reaction.emoji.name] - 1] = '🅾️';
                        userTurn === message.author ? userTurn = message.mentions.members.first() : userTurn = message.author;
                    };
		    sendBoard();
                }).catch(collected => {
                    gameOver('timeout');
                });
            };
            function gameOver(winner, board) {
                msg.reactions.removeAll();
                if(winner === 'tie') {
                    msg.edit(`It's a tie!\n${board}`);
                } else if(winner === 'timeout') {
                    msg.edit(`Game over... ${userTurn} didn't pick their move in time!`);
                } else {
                    msg.edit(`${winner} Won!\n${board}`);
                    msg.react('<:congratz:733204036253384765>');
                    msg.react('<:vibin:733203304758247464>');
                };
            };
        };
    }
};
