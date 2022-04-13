const { Appwrite } = require('appwrite')
const api = new Appwrite();
api.setEndpoint('https://lwj.sideproject.live/v1');
api.setProject('624f182c32b28d93bab3');
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    api.setJWT(event.headers.jwt.toString());
    await api.database.createDocument('votes', 'unique()', {
      userId: body.userId,
      itemId: body.itemId
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
