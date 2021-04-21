import chalk from 'chalk';
import { THREE, MESSAGE_LIMITS } from 'constants';

const Examples = {
  name: 'examples',
  description: `Searches ${THREE.EXAMPLES_URL} for examples matching query.`,
  options: [
    {
      name: 'query',
      description: 'Query to search related examples for',
      type: 'string',
      required: true,
    },
  ],
  async execute({ options, examples }) {
    const [query] = options;

    try {
      // Check for an example if key was specified
      const targetKey = query.replace(/\s/g, '_').toLowerCase();
      const exactMatch = examples.find(
        ({ name }) =>
          name === targetKey || name.split('_').every(frag => targetKey.includes(frag))
      );

      // Fuzzy search for related examples
      const results = examples.reduce((matches, match) => {
        const isMatch = query
          .split(/\s|_/)
          .some(frag => match?.keywords.includes(frag.toLowerCase()));
        if (isMatch) matches.push(match);

        return matches;
      }, []);

      // Handle no matches
      if (!exactMatch && !results.length) {
        return {
          content: `No examples were found for \`${query}\`.`,
          ephemeral: true,
        };
      }

      // Handle single match
      if (exactMatch || results.length === 1) {
        const result = exactMatch || results?.[0];

        return result;
      }

      // Handle multiple matches
      return {
        content: results
          .sort((a, b) => a - b)
          .reduce((message, { name, url }) => {
            const result = `\n• **[${name}](${url})**`;
            if (message.length + result.length <= MESSAGE_LIMITS.CONTENT_LENGTH)
              message += result;

            return message;
          }, `No examples were found for \`${query}\`.\n\nRelated examples:`),
        ephemeral: true,
      };
    } catch (error) {
      console.error(chalk.red(`/examples ${query} >> ${error.stack}`));
    }
  },
};

export default Examples;
