/**
 * Shared: Pagination helper (normalize params, build meta).
 */
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  normalizePaginationParams,
  buildPaginationMeta,
} from '../../../../src/shared/infrastructure/persistence/pagination/base-pagination';

describe('Pagination (shared)', () => {
  describe('constants', () => {
    it('DEFAULT_PAGE is 1', () => expect(DEFAULT_PAGE).toBe(1));
    it('DEFAULT_LIMIT is 20', () => expect(DEFAULT_LIMIT).toBe(20));
    it('MAX_LIMIT is 100', () => expect(MAX_LIMIT).toBe(100));
  });

  describe('normalizePaginationParams', () => {
    it('returns defaults when undefined', () => {
      const p = normalizePaginationParams(undefined, undefined);
      expect(p.page).toBe(1);
      expect(p.limit).toBe(20);
    });

    it('clamps page to at least 1', () => {
      expect(normalizePaginationParams(0, 10).page).toBe(1);
      expect(normalizePaginationParams(-1, 10).page).toBe(1);
    });

    it('clamps limit to MAX_LIMIT', () => {
      expect(normalizePaginationParams(1, 200).limit).toBe(100);
      expect(normalizePaginationParams(1, 50).limit).toBe(50);
    });

    it('clamps limit to at least 1', () => {
      expect(normalizePaginationParams(1, 0).limit).toBe(1);
    });
  });

  describe('buildPaginationMeta', () => {
    it('returns total, count, limit, totalPages, currentPage', () => {
      const meta = buildPaginationMeta(95, 2, 20, 20);
      expect(meta.total).toBe(95);
      expect(meta.count).toBe(20);
      expect(meta.limit).toBe(20);
      expect(meta.totalPages).toBe(5);
      expect(meta.currentPage).toBe(2);
    });

    it('totalPages is at least 1', () => {
      const meta = buildPaginationMeta(0, 1, 20, 0);
      expect(meta.totalPages).toBe(1);
    });
  });
});
