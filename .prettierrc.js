module.exports = {
  singleQuote: true,
  overrides: [
    {
      files: ['**/*.{scss,yml}'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
