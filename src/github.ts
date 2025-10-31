import type { GitHubIssue } from "./types.js"

export async function fetchGitHubIssues(): Promise<GitHubIssue[]> {
    const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/")
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_PAT}`,
            Accept: "application/vnd.github+json",
        },
    })

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return (await response.json()) as GitHubIssue[]
}
