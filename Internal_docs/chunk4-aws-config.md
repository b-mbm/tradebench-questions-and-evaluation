# Chunk 4 — AWS config (READY; no secrets here)

AWS access is verified and ready for Chunk 4 SageMaker provisioning. Credentials live in
`~/.aws/credentials` (profile imported by owner); the handoff .txt was deleted after verification.

- **Profile:** `benchmark-design` (use `AWS_PROFILE=benchmark-design` or boto3 `profile_name="benchmark-design"`)
- **Region:** `us-east-1`
- **Verified identity:** `arn:aws:iam::347011900516:user/benchmark-design`
- **SageMaker execution role:** `benchmark-design-sagemaker-exec` (pass as the training job's execution
  role; full ARN = `arn:aws:iam::<account>:role/benchmark-design-sagemaker-exec`, account via
  `aws sts get-caller-identity --profile benchmark-design`)
- **Permissions:** full SageMaker + S3 + ECR; scoped IAM (PassRole to SageMaker, create/manage
  `benchmark-design-*` roles); NOT account-admin.

## Chunk 4 action (when the loop reaches it — owner said "after the loops are done")
Provision with the `benchmark-design` profile: IAM/role check, S3 bucket, upload the V2 data, define the
SageMaker fine-tuning job for Qwen3.6-27B using the exec role above — then **STOP. Do NOT launch
training** (Chunk 5 is owner-present). Best handled as a focused step after Chunks 1–3 finish.
