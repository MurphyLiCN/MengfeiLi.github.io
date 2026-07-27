#!/usr/bin/env node

import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const target =
  process.argv[2] ||
  process.env.SITE_URL ||
  "http://localhost:4000/MengfeiLi.github.io/";
const runs = Number(process.env.LIGHTHOUSE_RUNS || 3);
const categories = ["performance", "accessibility", "best-practices", "seo"];
const metrics = {
  lcp: "largest-contentful-paint",
  cls: "cumulative-layout-shift",
  tbt: "total-blocking-time",
};
const samples = [];

for (let index = 0; index < runs; index += 1) {
  const chrome = await launch({
    chromeFlags: [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--no-first-run",
    ],
  });
  try {
    const result = await lighthouse(target, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: categories,
      formFactor: "mobile",
    });
    if (result.lhr.runtimeError) {
      console.error(`Run ${index + 1} runtime error:`, result.lhr.runtimeError);
    }
    if (result.lhr.runWarnings.length) {
      console.error(`Run ${index + 1} warnings:`, result.lhr.runWarnings);
    }
    const scores = Object.fromEntries(
      categories.map((category) => [
        category,
        Math.round(result.lhr.categories[category].score * 100),
      ])
    );
    const measurements = Object.fromEntries(
      Object.entries(metrics).map(([name, audit]) => [
        name,
        result.lhr.audits[audit].numericValue,
      ])
    );
    samples.push({ scores, measurements });
    console.log(`Run ${index + 1}:`, { ...scores, ...measurements });
    if (
      Object.values(scores).some((score) => score < 90) ||
      measurements.lcp > 2_500 ||
      measurements.cls > 0.1 ||
      measurements.tbt > 200
    ) {
      const failedAudits = Object.values(result.lhr.audits)
        .filter((audit) => audit.score !== null && audit.score < 1)
        .map((audit) => ({
          id: audit.id,
          score: audit.score,
          displayValue: audit.displayValue,
          errorMessage: audit.errorMessage,
        }));
      console.error(`Run ${index + 1} non-passing audits:`, failedAudits);
      for (const auditId of [
        "errors-in-console",
        "color-contrast",
        "target-size",
        "font-display-insight",
        "lcp-breakdown-insight",
      ]) {
        const audit = result.lhr.audits[auditId];
        if (audit && audit.score !== null && audit.score < 1) {
          console.error(
            `Run ${index + 1} ${auditId} details:`,
            JSON.stringify(audit.details, null, 2)
          );
        }
      }
    }
  } finally {
    await chrome.kill();
  }
}

const median = Object.fromEntries(
  categories.map((category) => {
    const values = samples
      .map((sample) => sample.scores[category])
      .sort((a, b) => a - b);
    return [category, values[Math.floor(values.length / 2)]];
  })
);
const medianMetrics = Object.fromEntries(
  Object.keys(metrics).map((metric) => {
    const values = samples
      .map((sample) => sample.measurements[metric])
      .sort((a, b) => a - b);
    return [metric, values[Math.floor(values.length / 2)]];
  })
);
console.log("Median:", { ...median, ...medianMetrics });

const thresholds = {
  performance: 90,
  accessibility: 95,
  "best-practices": 95,
  seo: 95,
};
const failures = categories.filter((category) => median[category] < thresholds[category]);
if (medianMetrics.lcp > 2_500) failures.push(`lcp=${medianMetrics.lcp}>2500`);
if (medianMetrics.cls > 0.1) failures.push(`cls=${medianMetrics.cls}>0.1`);
if (medianMetrics.tbt > 200) failures.push(`tbt=${medianMetrics.tbt}>200`);
if (failures.length) {
  console.error(
    "Lighthouse thresholds not met:",
    failures
      .map((failure) =>
        categories.includes(failure)
          ? `${failure}=${median[failure]}<${thresholds[failure]}`
          : failure
      )
      .join(", ")
  );
  process.exit(1);
}
