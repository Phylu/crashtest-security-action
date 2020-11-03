# Crashtest Security Action

A Github Action for Running a Crashtest Security scan to perform Dynamic Application Security Testing (DAST).

The Crashtest Security Suite will run a security scan against the scan target that belongs to the given webhook. You can optionally wait for the security scan to finish and download the report as JUnit XML file for further processing or simply start the security scan.

**WARNING** This action will perform attacks on the scan target. You must only run this security scan on targets where you have the permission to run such an attack.

## Inputs

### `crashtest-webhook`

**Required** Webhook Secret of the Crashtest Security Scan Target.

### `pull-report`

Flag whether the report should be downloaded as JUnit XML file. Default `"false"`.

## Example usage

```
uses: actions/crashtest-security-action@v1
with:
  crashtest-webhook: 'd43b0d95-0ebe-4b14-ba3e-9167e02b0d00'
  pull-report: 'false'
```