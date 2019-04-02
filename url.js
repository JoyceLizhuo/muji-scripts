let prefix = '/snail/'

if (process.env.NODE_ENV !== 'production') {
  prefix = '/mock/'
}

const url = {
  hoem: `${prefix}/home`,
  way: `${prefix}/way`
}

export default url
