import "fastify";

import type { Repositories } from "../db/repositories/index.js";

declare module "fastify" {
  interface FastifyInstance {
    repos?: Repositories;
  }
}
