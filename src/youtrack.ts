import type { GitHubIssue, YouTrackIssue } from "./types.js"

export async function findYouTrackIssueByGitHubNumber(
    githubNumber: number
): Promise<string | null> {
    const query = `[GH-${githubNumber}]`
    const url = `${
        process.env.YOUTRACK_URL
    }/api/issues?query=${encodeURIComponent(query)}&fields=id,summary`

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.YOUTRACK_TOKEN}`,
            Accept: "application/json",
        },
    })

    if (!res.ok) {
        return null
    }

    const issues = (await res.json()) as YouTrackIssue[]

    const exactMatch = issues.find((issue) =>
        issue.summary.includes(`[GH-${githubNumber}]`)
    )

    return exactMatch ? exactMatch.id : null
}

export async function createYouTrackIssue(
    issue: GitHubIssue
): Promise<string | null> {
    const url = `${process.env.YOUTRACK_URL}/api/issues`

    const state = issue.state === "open" ? "To Do" : "Done"

    const payload = {
        project: {
            $type: "Project",
            shortName: process.env.YOUTRACK_PROJECT_ID,
        },
        summary: `[GH-${issue.number}] ${issue.title}`,
        description: issue.body || "No description provided",
        customFields: [
            {
                $type: "StateIssueCustomField",
                name: "State",
                value: {
                    name: state,
                },
            },
        ],
    }

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.YOUTRACK_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        console.error(`Failed to create YouTrack issue (${res.statusText})`)
        console.error(await res.json())
        return null
    }

    const result = (await res.json()) as YouTrackIssue
    return result.id
}

export async function updateYouTrackIssue(
    youtrackId: string,
    issue: GitHubIssue
) {
    const url = `${process.env.YOUTRACK_URL}/api/issues/${youtrackId}`

    const state = issue.state === "open" ? "To Do" : "Done"

    const payload = {
        summary: `[GH-${issue.number}] ${issue.title}`,
        description: issue.body || "No description provided",
        customFields: [
            {
                $type: "StateIssueCustomField",
                name: "State",
                value: {
                    name: state,
                },
            },
        ],
    }

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.YOUTRACK_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        console.error(`Failed to update YouTrack issue (${res.statusText})`)
    }
}
