---
title: "Distribution Shift Alignment Helps LLMs Simulate Survey Response Distributions"
authors:
  - "Ji Huang"
  - "Mengfei Li"
  - "Shuai Shao"
collection: publications
category: published-papers
permalink: /publication/2026-distribution-shift-alignment
excerpt: "Introduces Distribution Shift Alignment, a two-stage fine-tuning method that learns distribution shifts across respondent backgrounds to improve LLM-based survey simulation."
date: 2026-07-01
year: 2026
status: "Published"
venue: "Findings of the Association for Computational Linguistics: ACL 2026 (CCF-A)"
publisher: "Association for Computational Linguistics"
pages: "9395-9409"
doi: "10.18653/v1/2026.findings-acl.457"
paperurl: "https://aclanthology.org/2026.findings-acl.457/"
---

## Abstract

Large language models (LLMs) offer a promising way to simulate human survey responses, potentially reducing the cost of large-scale data collection. However, existing zero-shot methods suffer from prompt sensitivity and low accuracy, while conventional fine-tuning approaches mostly fit the training set distributions and struggle to produce results more accurate than the training set itself, which deviates from the original goal of using LLMs to simulate survey responses. Building on this observation, we introduce Distribution Shift Alignment (DSA), a two-stage fine-tuning method that aligns both the output distributions and the distribution shifts across different backgrounds. By learning how these distributions change rather than fitting training data, DSA can provide results substantially closer to the true distribution than the training data. Empirically, DSA consistently outperforms other methods on five public survey datasets. We further conduct a comprehensive comparison covering accuracy, robustness, and data savings. DSA reduces the required real data by 53.48-69.12%, demonstrating its effectiveness and efficiency in survey simulation.
