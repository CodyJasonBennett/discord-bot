import chalk from 'chalk';
import config from '../config';
import { embed } from '../utils';

const Help = {
  name: 'help',
  description: "Displays this bot's commands.",
  execute({ client, msg }) {
    try {
      return msg.channel.send(
        embed({
          title: 'Commands',
          footer: {
            text: `${config.prefix}help`,
          },
          fields: client.commands.map(({ name, args, description }) => {
            return {
              name: `${config.prefix}${name}${
                args ? args.map(arg => ` \`${arg}\``) : ''
              }`,
              value: description,
            };
          }),
        })
      );
    } catch (error) {
      console.error(chalk.red(`${config.prefix}help >> ${error.stack}`));
    }
  },
};

export default Help;
