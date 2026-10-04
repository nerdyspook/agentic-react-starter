---
name: review-change
description: Review a completed milestone against its requirements before committing.
---

1. Identify the review target and relevant acceptance criteria.
2. Delegate the review to the interview_reviewer subagent.
3. Give it the diff target and requirement file paths.
4. Wait for its findings.
5. Check whether each reported issue is supported by the code.
6. Summarize actionable findings and verification gaps.
7. Do not modify files or commit during this review.
