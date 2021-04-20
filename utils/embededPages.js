module.exports = {
    embededPages: async function(message, embedMessage, array, frontDescription) {
        var itempages = array;
        var page = 1;
        embedMessage
            .setDescription(`${typeof frontDescription !== 'undefined' ? `${frontDescription}` : ''}${itempages[page-1]}`)
            .setFooter(`Page ${page} of ${itempages.length}`)
        const msg = await message.channel.send(embedMessage)
        msg.react('⬅️').then(() => {
            msg.react('➡️').then(() => {
                msg.react('🗑️')
            });
        });
        // Filters
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === message.author.id;
        const deleteEmbedFilter = (reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id;
        
        const backwards = msg.createReactionCollector(backwardsFilter, {timer: 60000});
        const forwards = msg.createReactionCollector(forwardsFilter, {timer: 60000});
        const deleteEmbed = msg.createReactionCollector(deleteEmbedFilter, {timer: 60000});
    //!backwards embed
        backwards.on('collect', async () => {
            if(page === itempages.length - itempages.length + 1) {
                page = itempages.length;
                    embedMessage
                        .setDescription(`${typeof frontDescription !== 'undefined' ? `${frontDescription}` : ''}${itempages[page - 1]}`)
                        .setFooter(`Page ${page} of ${itempages.length}`);
                    msg.edit(embedMessage);
                if(message.guild.me.hasPermission('MANAGE_MESSAGES'))
                    await msg.reactions.cache.find(r => r.emoji.name === '⬅️').users.remove(message.author.id);
            } else {
                page--;
                    embedMessage
                        .setDescription(`${typeof frontDescription !== 'undefined' ? `${frontDescription}` : ''}${itempages[page-1]}`)
                        .setFooter(`Page ${page} of ${itempages.length}`);
                    msg.edit(embedMessage)
                if(message.guild.me.hasPermission('MANAGE_MESSAGES'))
                    await msg.reactions.cache.find(r => r.emoji.name === '⬅️').users.remove(message.author.id);
            };
        });
    //!Forwards embed
        forwards.on('collect', async () => {
            if(page === itempages.length) {
                page = 1;
                    embedMessage
                        .setDescription(`${typeof frontDescription !== 'undefined' ? `${frontDescription}` : ''}${itempages[page - 1]}`)
                        .setFooter(`Page ${1} of ${itempages.length}`);
                    msg.edit(embedMessage);
                if(message.guild.me.hasPermission('MANAGE_MESSAGES'))
                    await msg.reactions.cache.find(r => r.emoji.name === '➡️').users.remove(message.author.id);
            } else {
                page++;
                    embedMessage
                        .setDescription(`${typeof frontDescription !== 'undefined' ? `${frontDescription}` : ''}${itempages[page-1]}`)
                        .setFooter(`Page ${page} of ${itempages.length}`);
                    msg.edit(embedMessage);
                if(message.guild.me.hasPermission('MANAGE_MESSAGES'))
                    await msg.reactions.cache.find(r => r.emoji.name === '➡️').users.remove(message.author.id);
            };
        });
    //!Delete embed
        deleteEmbed.on('collect', async () => {
            msg.delete()
            if(message.guild.me.hasPermission('MANAGE_MESSAGES'))
                message.delete();
        });
    }
};