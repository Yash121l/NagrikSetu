import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CorrectionInputError, buildCorrectionSubmission, submitCorrection } from "@/lib/corrections";

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
  });
});
