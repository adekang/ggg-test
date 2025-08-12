module.exports = {
  '/api/business/list':{
    get:{
      query:{
        type:'object',
        properties: {
          page: {
            type: 'string',
          },
          size: {
            type: 'string',
          },
        },
      }
    }
  }
}