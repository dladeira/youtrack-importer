# YouTrack Importer

Syncs GitHub issues to YouTrack. Open issues become "To Do", closed issues become "Done".

## Setup

Create a `.env` file:

```
GITHUB_PAT=your_github_personal_access_token
GITHUB_REPOSITORY=owner/repo
YOUTRACK_URL=https://your-instance.youtrack.cloud
YOUTRACK_TOKEN=your_youtrack_api_token
YOUTRACK_PROJECT_ID=PROJECT
```

## Usage

**NPM:**

```bash
npm install
npm run build
npm start
```

**Docker:**

```bash
make build
make start
make stop
```
