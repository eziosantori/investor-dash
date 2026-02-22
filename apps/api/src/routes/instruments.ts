import type { FastifyInstance } from "fastify";
import { z } from "zod";

const idParamsSchema = z.object({
  id: z.string().min(1),
});

const listQuerySchema = z.object({
  journalId: z.string().min(1),
});

const createInstrumentBodySchema = z.object({
  journalId: z.string().min(1),
  ticker: z.string().trim().min(1),
  instrumentType: z.string().trim().min(1),
  defaultLeverage: z.number().positive(),
  minLot: z.number().positive(),
  lotStep: z.number().positive(),
  marketTimezone: z.string().trim().min(1),
  sessionOpenTime: z.string().regex(/^\d{2}:\d{2}$/),
  sessionCloseTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const updateInstrumentBodySchema = createInstrumentBodySchema
  .omit({ journalId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one updatable field is required",
  });

function buildValidationError(message: string, details?: unknown) {
  return {
    code: "invalid_payload",
    message,
    ...(details ? { details } : {}),
  };
}

// Instrument catalog CRUD routes for milestone 2.
export async function registerInstrumentRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { journalId?: string } }>("/api/instruments", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const parsedQuery = listQuerySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      return reply.code(400).send(buildValidationError("journalId is required", parsedQuery.error.flatten()));
    }

    return app.repos.instruments.listByJournalId(parsedQuery.data.journalId);
  });

  app.get<{ Params: { id: string } }>("/api/instruments/:id", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const parsedParams = idParamsSchema.safeParse(request.params);
    if (!parsedParams.success) {
      return reply.code(400).send(buildValidationError("Invalid instrument id", parsedParams.error.flatten()));
    }

    const instrument = await app.repos.instruments.findById(parsedParams.data.id);
    if (!instrument) {
      return reply.code(404).send({ code: "not_found", message: "Instrument not found" });
    }

    return instrument;
  });

  app.post("/api/instruments", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const parsedBody = createInstrumentBodySchema.safeParse(request.body);
    if (!parsedBody.success) {
      return reply.code(400).send(buildValidationError("Invalid instrument payload", parsedBody.error.flatten()));
    }

    const instrument = await app.repos.instruments.create(parsedBody.data);
    return reply.code(201).send(instrument);
  });

  app.put<{ Params: { id: string } }>("/api/instruments/:id", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const parsedParams = idParamsSchema.safeParse(request.params);
    if (!parsedParams.success) {
      return reply.code(400).send(buildValidationError("Invalid instrument id", parsedParams.error.flatten()));
    }

    const parsedPatch = updateInstrumentBodySchema.safeParse(request.body);
    if (!parsedPatch.success) {
      return reply
        .code(400)
        .send(buildValidationError("At least one updatable field is required", parsedPatch.error.flatten()));
    }

    const updated = await app.repos.instruments.update(parsedParams.data.id, parsedPatch.data);
    if (!updated) {
      return reply.code(404).send({ code: "not_found", message: "Instrument not found" });
    }

    return updated;
  });

  app.delete<{ Params: { id: string } }>("/api/instruments/:id", async (request, reply) => {
    if (!app.repos) {
      return reply.code(503).send({ code: "service_unavailable", message: "Repositories not configured" });
    }

    const parsedParams = idParamsSchema.safeParse(request.params);
    if (!parsedParams.success) {
      return reply.code(400).send(buildValidationError("Invalid instrument id", parsedParams.error.flatten()));
    }

    const removed = await app.repos.instruments.delete(parsedParams.data.id);
    if (!removed) {
      return reply.code(404).send({ code: "not_found", message: "Instrument not found" });
    }

    return reply.code(204).send();
  });
}
