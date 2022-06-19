const axios = require("axios")
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { convert } = require('html-to-text');


const POST_NODE_TYPE = `Post`


function chunkArray(arr, value) {
  const finalArray = [];
  if (arr?.length) {
      for (let i = 0; i < arr.length; i += value) {
          finalArray.push(arr.slice(i, value + i));
      }
  }
  return finalArray;
}

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions
  const data = await axios
    .get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail")
    .then((response) => {
      response?.data?.drinks?.forEach(async post => {
        let url = `https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=${post.strDrink}`
        let informationData = await axios.get(encodeURI(url))

        let informationHtml 
        if(informationData?.data?.parse?.text){
          informationHtml = Object.values(informationData?.data?.parse?.text)[0]
        }
       
        const text =  convert(informationHtml) 

       let reformedText = text.substring(0, 100).concat('...')


       

        createNode({
          ...post,
          id: createNodeId(`${POST_NODE_TYPE}-${post.idDrink}`),
          furtherInformationHTML: informationData?.data?.parse?.text,
          furtherInformationExcerpt: reformedText,
          relatedDrinks: chunkArray(response?.data?.drinks, 3),
          parent: null,
          children: [],
          internal: {
            type: POST_NODE_TYPE,
            content: JSON.stringify(post),
            contentDigest: createContentDigest(post),
          },
        })
      })
   })
  return
}

exports.onCreateNode = async ({
  node, // i.e. the just-created node
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
}) => {
  if (node.internal.type === POST_NODE_TYPE) {
    const fileNode = await createRemoteFileNode({
      // The remote image URL for which to generate a node.
      url: node.strDrinkThumb,
      parentNodeId: node.idDrink,
      createNode,
      createNodeId,
      getCache,
    })
    if (fileNode) {
      createNodeField({ node, name: "localFile", value: fileNode.id })
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type Post implements Node {
      post: Post
      featuredImg: File @link(from: "fields.localFile")
    }
    type Post {
      idDrink: String!
      strDrink: String
      strDrinkThumb: String
    }
  `)
}

exports.onPreInit = () => console.log("testing")
