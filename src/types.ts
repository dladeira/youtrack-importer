export interface GitHubIssue {
    id: number
    number: number
    title: string
    state: string
    body: string | null
}

export interface YouTrackIssue {
    id: string
    summary: string
    description: string
    customFields: Array<{ name: string; value: any }>
}
