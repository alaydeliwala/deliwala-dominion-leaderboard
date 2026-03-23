export function verifyPassword(provided: string): boolean {
  const master = process.env.MASTER_PASSWORD
  if (!master) throw new Error('MASTER_PASSWORD env var not set')
  return provided === master
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}
