const filterTopics = req.user.topics.map(t => {
  return {
    filter: {
      term: { topics: t }
    },
    weight: 5
  }
})

const query = {
  query: {
    function_score: {
      query: {
        match_all: {}
      },
      functions: [
        {
          gauss: {
            time: {
              origin: 'now',
              scale: '4h',
              offset: '2h',
              decay: 0.5
            }
          }
        },
        ...filterTopics
      ],
      boost_mode: 'multiply'
    }
  },
  size: 10,
  from: req.query.from || 0
}
