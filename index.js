const fs = require('fs')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const React = require('react')
const StaticRouter = require('react-router').StaticRouter
const config = require('./webpack.dev.js')
import App from './src/App'

require('cross-fetch/polyfill')

const ApolloProvider = require('react-apollo').ApolloProvider
const renderToStringWithData = require('react-apollo').renderToStringWithData
const ApolloClient = require('apollo-client').ApolloClient
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache
const createHttpLink = require('apollo-link-http').createHttpLink
// const setContext = require('apollo-link-context').setContext

const app = express()
const HTML_FILE = path.join(__dirname, config.output.publicPath, "index.html")
const PORT = 4000

app.set('port', process.env.PORT || PORT)

const compiler = webpack(config)

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}))

app.get("/*", (req, res) => {
    const template = compiler.outputFileSystem.readFileSync(HTML_FILE, 'utf8')
    sendRes(req, res, template)
})

function sendRes(req, res, template){
    const context = {}

    const httpLink = createHttpLink({
      uri: 'https://gruesome-vampire-41677.herokuapp.com/graphql',
      headers: {
          authorization: true
      }
    })

    const client = new ApolloClient({
        ssrMode: true,
        link: httpLink,
        cache: new InMemoryCache()
    });

    const WithProvider = (
        <ApolloProvider client={client}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </ApolloProvider>
    )

    renderToStringWithData(WithProvider).then((content) => {
        const apolloState = client.extract()

        const html = template
            .replace('{{content}}', content)
            .replace('"{{apolloState}}"', JSON.stringify(apolloState).replace(/</g, '\\u003c'))

        res.writeHead( 200, { "Content-Type": "text/html" } )
        res.end( html )
    })
    .catch(e => {
        res.status(500)
		res.end(
		  `An error occurred:\n\n${
			e.stack
		  }`
		)
    })
}

app.listen(app.get('port'), function () {
    console.log(`App running at http://localhost:${app.get('port')}`)
})