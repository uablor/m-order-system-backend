/**
 * Shared: Global response contract (status, message, data, pagination, error).
 */
import { ResponseBuilder } from '../../../../src/shared/application/response/ResponseBuilder';
import type { BaseResponse, PaginationMeta } from '../../../../src/shared/application/response/BaseResponse';

describe('ResponseBuilder', () => {
  describe('success', () => {
    it('returns envelope with status success, message, data', () => {
      const res = ResponseBuilder.success({ id: '1' }, 'Created');
      expect(res).toEqual<BaseResponse<{ id: string }>>({
        status: 'success',
        message: 'Created',
        data: { id: '1' },
      });
      expect(res.pagination).toBeUndefined();
      expect(res.error).toBeUndefined();
    });

    it('default message is OK', () => {
      const res = ResponseBuilder.success(null);
      expect(res.message).toBe('OK');
      expect(res.status).toBe('success');
    });
  });

  describe('successPaginated', () => {
    it('returns envelope with data and pagination', () => {
      const data = [{ id: '1' }];
      const pagination: PaginationMeta = {
        total: 100,
        count: 1,
        limit: 20,
        totalPages: 5,
        currentPage: 1,
      };
      const res = ResponseBuilder.successPaginated(data, pagination);
      expect(res.status).toBe('success');
      expect(res.data).toEqual(data);
      expect(res.pagination).toEqual(pagination);
      expect(res.error).toBeUndefined();
    });
  });

  describe('error', () => {
    it('returns envelope with status error, message, code, details', () => {
      const res = ResponseBuilder.error('Not found', 'NOT_FOUND', { entity: 'Order' });
      expect(res.status).toBe('error');
      expect(res.message).toBe('Not found');
      expect(res.data).toBeNull();
      expect(res.error).toEqual({ code: 'NOT_FOUND', details: { entity: 'Order' } });
    });

    it('details is optional', () => {
      const res = ResponseBuilder.error('Bad request', 'VALIDATION_ERROR');
      expect(res.error).toEqual({ code: 'VALIDATION_ERROR' });
    });
  });
});
