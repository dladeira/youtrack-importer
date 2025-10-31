import "dotenv/config"
import { fetchGitHubIssues } from "./github.js"
import {
    createYouTrackIssue,
    updateYouTrackIssue,
    findYouTrackIssueByGitHubNumber,
} from "./youtrack.js"
import type { GitHubIssue } from "./types.js"

const SYNC_INTERVAL = 5 * 1000 // 5 sec
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function bootstrap() {
    while (true) {
        verifyEnv()

        console.log("Starting sync...")

        const githubIssues = await fetchGitHubIssues()

        for (const issue of githubIssues) {
            const youtrackId = await findYouTrackIssueByGitHubNumber(
                issue.number
            )

            await syncOrCreateYoutrackIssue(youtrackId, issue)
        }

        console.log("Sync complete!")

        await wait(SYNC_INTERVAL)
    }
}

async function syncOrCreateYoutrackIssue(
    youtrackId: string | null,
    issue: GitHubIssue
) {
    if (youtrackId) {
        console.log(`Syncing: #${issue.number} -> ${youtrackId}`)
        await updateYouTrackIssue(youtrackId, issue)
    } else {
        console.log(`Importing: #${issue.number} - ${issue.title}`)
        const newYoutrackId = await createYouTrackIssue(issue)

        if (newYoutrackId) {
            console.log(`Created: ${newYoutrackId}`)
        }
    }
}

function verifyEnv() {
    const requiredEnvVars = [
        "GITHUB_PAT",
        "GITHUB_REPOSITORY",
        "YOUTRACK_URL",
        "YOUTRACK_TOKEN",
        "YOUTRACK_PROJECT_ID",
    ]

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing ${envVar} in .env`)
        }
    }
}

bootstrap()
