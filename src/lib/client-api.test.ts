import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, SEARCH_SOURCE_BATCH_SIZE } from './client-api';
import type { SearchStreamEvent, SourceConfig } from './types';

afterEach(() => {
  vi.unstubAllGlobals();
});

function sources(count: number): SourceConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `source_${i}`,
    name: `源 ${i}`,
    url: `https://source-${i}.example/api`,
  }));
}

describe('api.search Cloudflare batching', () => {
  it('普通搜索按每批 5 个源拆分，并合并结果', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { sources: SourceConfig[] };
      return Response.json({
        list: body.sources.map((source) => ({
          sourceKey: source.key,
          sourceName: source.name,
          sourceUrl: source.url,
          vodId: source.key,
          name: source.key === 'source_11' ? '目标影片' : `影片 ${source.key}`,
        })),
        failures: [],
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.search('目标影片', sources(12), true);

    expect(SEARCH_SOURCE_BATCH_SIZE).toBe(5);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls.map((call) => JSON.parse(String(call[1]?.body)).sources.length)).toEqual([5, 5, 2]);
    expect(result.list).toHaveLength(12);
    expect(result.list[0].name).toBe('目标影片');
  });

  it('流式搜索也按批拆分，并保留所有逐源回调', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { sources: SourceConfig[] };
      const events: SearchStreamEvent[] = body.sources.map((source) => ({
        type: 'source',
        sourceKey: source.key,
        ok: true,
        ms: 10,
        list: [],
      }));
      events.push({ type: 'done', list: [], failures: [] });
      return new Response(events.map((event) => JSON.stringify(event)).join('\n') + '\n');
    });
    vi.stubGlobal('fetch', fetchMock);
    const settled: string[] = [];

    const result = await api.search('影片', sources(7), true, {
      onSource: (outcome) => settled.push(outcome.sourceKey),
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(settled.sort()).toEqual(sources(7).map((source) => source.key).sort());
    expect(result).toEqual({ list: [], failures: [] });
  });
});
