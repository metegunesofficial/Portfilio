/**
 * Rate limit utility for contact form submissions.
 * Limits to 3 submissions per 5-minute window using localStorage.
 */

const STORAGE_KEY = 'contact_form_submissions'
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutes in ms
const MAX_SUBMISSIONS = 3

interface SubmissionRecord {
    timestamps: number[]
}

function getSubmissions(): number[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return []
        const record: SubmissionRecord = JSON.parse(stored)
        return record.timestamps || []
    } catch {
        return []
    }
}

function setSubmissions(timestamps: number[]): void {
    const record: SubmissionRecord = { timestamps }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

function getRecentSubmissions(): number[] {
    const now = Date.now()
    const submissions = getSubmissions()
    // Filter to only submissions within the rate limit window
    return submissions.filter((ts) => now - ts < RATE_LIMIT_WINDOW)
}

export function canSubmit(): boolean {
    const recent = getRecentSubmissions()
    return recent.length < MAX_SUBMISSIONS
}

export function recordSubmission(): void {
    const recent = getRecentSubmissions()
    recent.push(Date.now())
    setSubmissions(recent)
}

export function getRemainingTimeSeconds(): number {
    const recent = getRecentSubmissions()
    if (recent.length < MAX_SUBMISSIONS) return 0

    // Find the oldest submission in the window
    const oldest = Math.min(...recent)
    const expiresAt = oldest + RATE_LIMIT_WINDOW
    const remaining = Math.ceil((expiresAt - Date.now()) / 1000)

    return Math.max(0, remaining)
}
