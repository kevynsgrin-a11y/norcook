/**
 * Mock Redis — an in-memory implementation of the sorted-set commands used to
 * power the trending leaderboard. It mirrors the API surface of `ioredis` /
 * Upstash so the call sites don't change when swapping in a real Redis client.
 *
 * Sorted sets give us O(log n) inserts and O(log n + m) range reads, which is
 * how a real deployment serves the "top trending" list with sub-millisecond
 * latency on initial page load instead of re-sorting the table every request.
 */

type ScoreMap = Map<string, number>

interface ZMember {
  member: string
  score: number
}

class MockRedis {
  private sortedSets = new Map<string, ScoreMap>()
  private kv = new Map<string, string>()

  /** ZADD key score member [score member ...] */
  zadd(key: string, ...args: Array<number | string>): number {
    const set = this.sortedSets.get(key) ?? new Map<string, number>()
    let added = 0
    for (let i = 0; i < args.length; i += 2) {
      const score = Number(args[i])
      const member = String(args[i + 1])
      if (!set.has(member)) added++
      set.set(member, score)
    }
    this.sortedSets.set(key, set)
    return added
  }

  /** ZREVRANGE key start stop WITHSCORES — highest score first. */
  zrevrangeWithScores(key: string, start = 0, stop = -1): ZMember[] {
    const set = this.sortedSets.get(key)
    if (!set) return []
    const sorted: ZMember[] = [...set.entries()]
      .map(([member, score]) => ({ member, score }))
      .sort((a, b) => b.score - a.score)
    const end = stop < 0 ? sorted.length + stop + 1 : stop + 1
    return sorted.slice(start, end)
  }

  /** ZSCORE key member */
  zscore(key: string, member: string): number | null {
    return this.sortedSets.get(key)?.get(member) ?? null
  }

  /** ZINCRBY key increment member — bump a recipe's live VCS. */
  zincrby(key: string, increment: number, member: string): number {
    const set = this.sortedSets.get(key) ?? new Map<string, number>()
    const next = (set.get(member) ?? 0) + increment
    set.set(member, next)
    this.sortedSets.set(key, set)
    return next
  }

  /** ZCARD key */
  zcard(key: string): number {
    return this.sortedSets.get(key)?.size ?? 0
  }

  set(key: string, value: string): 'OK' {
    this.kv.set(key, value)
    return 'OK'
  }

  get(key: string): string | null {
    return this.kv.get(key) ?? null
  }

  flushall(): 'OK' {
    this.sortedSets.clear()
    this.kv.clear()
    return 'OK'
  }
}

/**
 * Persist a single instance across hot-reloads in dev (Next.js re-evaluates
 * modules), the same guard pattern you'd use for a real client connection.
 */
const globalForRedis = globalThis as unknown as { __mockRedis?: MockRedis }

export const redis: MockRedis = globalForRedis.__mockRedis ?? new MockRedis()

if (!globalForRedis.__mockRedis) {
  globalForRedis.__mockRedis = redis
}
