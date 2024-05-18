import "core-js"
import "reflect-metadata"

import { register } from "./registry"
register()

import cors from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import { staticPlugin } from "@elysiajs/static"
import { trpc } from "@elysiajs/trpc"
import { executionContext } from "@undb/context/server"
import { graphql } from "@undb/graphql"
import { route } from "@undb/trpc"
import { Elysia } from "elysia"
import { requestID } from "elysia-requestid"
import { loggerPlugin } from "./plugins/logging"
import { ui } from "./routes/ui.route"

const app = new Elysia()
  .use(requestID())
  .onRequest(({ set }) => {
    const requestId = set.headers["X-Request-ID"]
    // TODO: remove test user
    executionContext.enterWith({ requestId, user: { userId: "test" } })
  })
  .use(staticPlugin({ prefix: "/", assets: "dist" }))
  .use(cors())
  .use(html())
  .use(loggerPlugin())
  .use(ui())
  .use(trpc(route))
  .use(graphql().yoga)

export type App = typeof app

app.listen(Bun.env.PORT ?? 4000, () => {
  app.decorator.logger.info(`App is running at ${app.server?.hostname}:${app.server?.port}`)
})
