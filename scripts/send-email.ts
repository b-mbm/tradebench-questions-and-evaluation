#!/usr/bin/env tsx

import { Resend } from "resend";

function usage() {
  console.error("Usage: npx tsx scripts/send-email.ts --to you@example.com --subject 'Title' --text 'Body' [--from from@example.com]");
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--to") args.to = argv[++i];
    else if (t === "--subject") args.subject = argv[++i];
    else if (t === "--text") args.text = argv[++i];
    else if (t === "--from") args.from = argv[++i];
  }
  return args;
}

async function main() {
  const { to, subject, text, from } = parseArgs(process.argv);
  if (!to || !subject || !text) {
    usage();
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY || "";
  const fromAddr = from || process.env.RESEND_FROM || "no-reply@tradebench.io";

  if (!apiKey) {
    console.log("RESEND_API_KEY not set; skipping email send.");
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({ from: fromAddr, to, subject, text });
  console.log(`📧 Email sent to ${to}`);
}

main().catch(err => {
  console.error("❌ send-email failed:", err);
  process.exit(1);
});

