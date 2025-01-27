import { Octokit } from "octokit";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";

const RetryAndThrottlingOctokit = Octokit.plugin(retry, throttling);

export const octokit: Octokit = new RetryAndThrottlingOctokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter, options, _o, retryCount) => {
      console.warn(
        `Rate limit hit: ${options.method} ${options.url}. Retry after ${retryAfter} seconds (Attempt ${retryCount}).`
      );
      return retryCount <= 3; // Retry up to 3 times
    },
    onSecondaryRateLimit: (retryAfter, options) => {
      console.warn(
        `Secondary rate limit hit for request ${options.method} ${options.url}. Retry after ${retryAfter} seconds.`
      );
      return true;
    },
  },
  request: {
    retries: 3, 
    retryAfter: 2, // Time before retrying
  },
});

/**
 * Fetch commit hashes from a GitHub repository.
 * @param githubUrl - The GitHub repository URL (e.g., https://github.com/owner/repo).
 * @returns An array of commit details.
 */