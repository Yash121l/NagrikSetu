import { z } from "zod";

const confidenceSchema = z.enum(["high", "medium", "low"]);
const entityKindSchema = z.enum(["office", "officer", "project", "road", "tender", "complaint", "source"]);
const sourcePrioritySchema = z.enum(["official", "open-government", "permissive-third-party"]);

const geoPointSchema = z.object({
  lat: z.number().min(6).max(38),
  lng: z.number().min(68).max(98)
});

const provenanceSchema = z.object({
  sourceName: z.string().min(2),
  sourceUrl: z.url(),
  lastChecked: z.iso.date(),
  priority: sourcePrioritySchema,
  licenseNote: z.string().min(12)
});

const civicBaseSchema = z.object({
  id: z.string().min(3).regex(/^[a-z0-9-]+$/),
  kind: entityKindSchema,
  title: z.string().min(4),
  summary: z.string().min(20),
  department: z.string().min(2),
  jurisdiction: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional(),
  website: z.url().optional(),
  issueTags: z.array(z.string().min(2)).min(1),
  languageTags: z.array(z.string().min(2)).min(1),
  location: geoPointSchema.optional(),
  confidence: confidenceSchema,
  updatedAt: z.iso.date(),
  provenance: provenanceSchema
});

export const officeRecordSchema = civicBaseSchema.extend({
  kind: z.literal("office"),
  services: z.array(z.string().min(3)).min(1),
  parentOffice: z.string().optional()
});

export const tenderRecordSchema = civicBaseSchema.extend({
  kind: z.literal("tender"),
  tenderNumber: z.string().min(3),
  closingDate: z.string().min(4),
  estimatedValue: z.string().optional(),
  documentUrl: z.url()
});

export const complaintRecordSchema = civicBaseSchema.extend({
  kind: z.literal("complaint"),
  portalUrl: z.url(),
  escalation: z.array(z.string().min(3)).min(1)
});

export const projectRecordSchema = civicBaseSchema.extend({
  kind: z.union([z.literal("project"), z.literal("road")]),
  contractor: z.string().optional(),
  status: z.string().min(3),
  budget: z.string().optional(),
  expectedCompletion: z.string().optional(),
  supervisingOffice: z.string().min(3)
});

export const sourceRecordSchema = civicBaseSchema.extend({
  kind: z.literal("source")
});

export const nagrikRecordSchema = z.discriminatedUnion("kind", [
  officeRecordSchema,
  tenderRecordSchema,
  complaintRecordSchema,
  projectRecordSchema,
  sourceRecordSchema
]);

export const nagrikRecordBatchSchema = z.array(nagrikRecordSchema);
