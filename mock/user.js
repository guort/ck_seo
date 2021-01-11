
export default [
  {
    url: '/login',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: {
          url: '/admin/index',
          JSTEESESSID: 'e20f2ef4-e398-479b-af86-5091f788ca65'
        }
      }
    }
  }

]

