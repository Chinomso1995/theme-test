module.exports = (options) => {
    const { googleFontOptions, siteUrl } = options
    return {
    siteMetadata: {
      
            siteUrl: siteUrl,
     },
      plugins: [
        "gatsby-plugin-theme-ui",
        "gatsby-plugin-sitemap",
        "gatsby-plugin-robots-txt",
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: googleFontOptions === undefined ? {
              fonts: [
                `limelight`,
                `source sans pro\:300,400,400i,700` // you can also specify font weights and styles
              ],
              display: 'swap'
            } : googleFontOptions
        }
      ],
    }
  }