module.exports = (api) => {
  api.cache(true)
  return {
    presets: [
      [
        '@babel/preset-react',
        {
          development: process.env.NODE_ENV !== 'production',
        },
      ],
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          allExtensions: true,
        },
      ],
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
          modules: 'commonjs',
        },
      ],
    ],
  }
}
