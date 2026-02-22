import type { FastifyInstance } from "fastify";

import type { CreateJournalInput, UpdateJournalInput } from "@investor-dash/shared-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCreateBody(body: unknown): CreateJournalInput | null {
  if (!isRecord(body) || typeof body.name !== "string" || body.name.trim().length === 0) {
    return null;
  }

  return {
    name: body.name,
    broker: typeof body.broker === "string" ? body.broker : undefined,
    baseCurrency: typeof body.baseCurrency === "string" ? body.baseCurrency : undefined,
    timezone: typeof body.timezone === "string" ? body.timezone : undefined,
  };
}

function parseUpdateBody(body: unknown): UpdateJournalInput | null {
  if (!isRecord(body)) {
    return null;
  }

  const patch: UpdateJournalInput = {};

  if (typeof body.name === "string") patch.name = body.name;
  if (typeof body.broker === "string" || body.broker === null) patch.broker = body.broker;
  if (typeof body.baseCurrency === "string") patch.baseCurrency = body.baseCurrency;
  if (typeof body.timezone === "string") patch.timezone = body.timezone;
  if (typeof body.isActive === "boolean") patch.isActive = body.isActive;

  return Object.keys(patch).length > 0 ? patch : null;
}

// Journal CRUD routes for milestone 2 bootstrap.
export async function registerJournalRoutes(app: FastifyInstance) {
  app.get("/api/journals", async (_request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    return app.repos.journals.list();
  });

  app.get<{ Params: { id: string } }>("/api/journals/:id", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const journal = await app.repos.journals.findById(request.params.id);
    if (!journal) {
      return reply.code(404).send({ code: "not_found", message: "Journal not found" });
    }

    return journal;
  });

  app.post("/api/journals", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const input = parseCreateBody(request.body);
    if (!input) {
      return reply.code(400).send({ code: "invalid_payload", message: "name is required" });
    }

    const journal = await app.repos.journals.create(input);
    return reply.code(201).send(journal);
  });

  app.put<{ Params: { id: string } }>("/api/journals/:id", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const patch = parseUpdateBody(request.body);
    if (!patch) {
      return reply.code(400).send({ code: "invalid_payload", message: "At least one updatable field is required" });
    }

    const updated = await app.repos.journals.update(request.params.id, patch);
    if (!updated) {
      return reply.code(404).send({ code: "not_found", message: "Journal not found" });
    }

    return updated;
  });

  app.delete<{ Params: { id: string } }>("/api/journals/:id", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const removed = await app.repos.journals.delete(request.params.id);
    if (!removed) {
      return reply.code(404).send({ code: "not_found", message: "Journal not found" });
    }

    return reply.code(204).send();
  });
}
