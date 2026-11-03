import { afterEach, describe, expect, it } from 'vitest';
import { getEnvSources } from './env-sources';

const saved = process.env.DEFAULT_SOURCES;

afterEach(() => {
  if (saved === undefined) delete process.env.DEFAULT_SOURCES;
  else process.env.DEFAULT_SOURCES = saved;
});

describe('getEnvSources', () => {
  it('接受部署者提供的稳定 env key', () => {
    process.env.DEFAULT_SOURCES = JSON.stringify([
      { key: 'env_360', name: '360资源站', url: 'https://example.com/api.php/' },
    ]);
    expect(getEnvSources()).toEqual([
      { key: 'env_360', name: '360资源站', url: 'https://example.com/api.php', detail: undefined, isAdult: false },
    ]);
  });

  it('无效或缺失 key 时继续使用索引 key', () => {
    process.env.DEFAULT_SOURCES = JSON.stringify([
      { key: 'unsafe key', name: '源一', url: 'https://one.example/api' },
      { name: '源二', url: 'https://two.example/api' },
    ]);
    expect(getEnvSources().map((source) => source.key)).toEqual(['env_0', 'env_1']);
  });
});
