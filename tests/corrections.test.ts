import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  CorrectionInputError,
  buildCorrectionSubmission,
  listCorrectionQueue,
  submitCorrection,
  updateCorrectionModeration
} from "@/lib/corrections";

let queueDir: string | undefined;

afterEach(async () => {
  if (queueDir) {
    await rm(queueDir, { recursive: true, force: true });
    queueDir = undefined;
  }
});

describe("Draft 3 correction queue", () => {
  it("normalizes correction input with stable moderation metadata", () => {
    const submission = buildCorrectionSubmission(
      {
        recordId: "road-demo-linking-road",
        message: " The contractor field needs a fresh source check. ",
        language: "hi"
      },
      new Date("2026-06-23T10:00:00.000Z")
    );

    expect(submission.recordId).toBe("road-demo-linking-road");
    expect(submission.message).toBe("The contractor field needs a fresh source check.");
    expect(submission.language).toBe("hi");
    expect(submission.status).toBe("new");
    expect(submission.id).toHaveLength(14);
    expect(submission.auditTrail).toHaveLength(1);
  });

  it("rejects submissions without enough detail", () => {
    expect(() => buildCorrectionSubmission({ recordId: "x", message: "bad" })).toThrow(CorrectionInputError);
  });

  it("rejects personal contact fields", () => {
    expect(() =>
      buildCorrectionSubmission({
        recordId: "complaint-bmc-road",
        message: "Please verify this source.",
        language: "en",
        contact: "person@example.test"
      })
    ).toThrow(CorrectionInputError);
  });

  it("persists correction submissions as queue artifacts", async () => {
    queueDir = await mkdtemp(path.join(tmpdir(), "nagriksetu-corrections-"));

    const result = await submitCorrection(
      {
        recordId: "complaint-bmc-road",
        message: "The source link is broken on mobile.",
        language: "en"
      },
      { now: new Date("2026-06-23T10:30:00.000Z"), queueDir }
    );

    const saved = JSON.parse(await readFile(result.filePath, "utf8"));
    expect(saved.recordId).toBe("complaint-bmc-road");
    expect(saved.contact).toBeUndefined();
    expect(saved.status).toBe("new");
    expect(saved.auditTrail[0].status).toBe("new");
  });

  it("lists and updates correction moderation state with an audit trail", async () => {
    queueDir = await mkdtemp(path.join(tmpdir(), "nagriksetu-corrections-"));
    const result = await submitCorrection(
      {
        recordId: "road-demo-linking-road",
        message: "The public source now has a named supervising office.",
        language: "en"
      },
      { now: new Date("2026-06-23T11:00:00.000Z"), queueDir }
    );

    const queue = await listCorrectionQueue(queueDir);
    expect(queue).toHaveLength(1);

    const updated = await updateCorrectionModeration(
      result.submission.id,
      {
        status: "source-check-needed",
        reviewerNote: "Check against official BMC page before accepting.",
        officialSourceUrl: "https://portal.mcgm.gov.in/"
      },
      { now: new Date("2026-06-23T11:05:00.000Z"), queueDir }
    );

    expect(updated?.submission.status).toBe("source-check-needed");
    expect(updated?.submission.reviewerNote).toContain("official BMC");
    expect(updated?.submission.auditTrail).toHaveLength(2);
  });

  it("rejects non-http moderation source URLs", async () => {
    queueDir = await mkdtemp(path.join(tmpdir(), "nagriksetu-corrections-"));
    const result = await submitCorrection(
      {
        recordId: "road-demo-linking-road",
        message: "Please verify the cited source URL.",
        language: "en"
      },
      { now: new Date("2026-06-23T11:10:00.000Z"), queueDir }
    );

    await expect(
      updateCorrectionModeration(
        result.submission.id,
        { status: "triaged", officialSourceUrl: "javascript:alert(1)" },
        { queueDir }
      )
    ).rejects.toThrow(CorrectionInputError);
  });

  it("skips malformed queue files while listing valid correction submissions", async () => {
    queueDir = await mkdtemp(path.join(tmpdir(), "nagriksetu-corrections-"));
    await writeFile(path.join(queueDir, "broken.json"), "{not-json", "utf8");
    await submitCorrection(
      {
        recordId: "complaint-bmc-road",
        message: "The source link is still useful.",
        language: "en"
      },
      { now: new Date("2026-06-23T11:20:00.000Z"), queueDir }
    );

    const queue = await listCorrectionQueue(queueDir);

    expect(queue).toHaveLength(1);
    expect(queue[0]?.submission.recordId).toBe("complaint-bmc-road");
  });

  it("fails closed when moderation admin token is not configured or does not match", () => {
    const originalToken = process.env.NAGRIKSETU_ADMIN_TOKEN;
    delete process.env.NAGRIKSETU_ADMIN_TOKEN;
    expect(isAdminRequest(new Headers({ authorization: "Bearer anything" }))).toBe(false);

    process.env.NAGRIKSETU_ADMIN_TOKEN = "expected";
    expect(isAdminRequest(new Headers({ authorization: "Bearer wrong" }))).toBe(false);
    expect(isAdminRequest(new Headers({ authorization: "Bearer expected" }))).toBe(true);

    if (originalToken === undefined) {
      delete process.env.NAGRIKSETU_ADMIN_TOKEN;
    } else {
      process.env.NAGRIKSETU_ADMIN_TOKEN = originalToken;
    }
  });
});
