/**
 * Shared: GlobalResponseInterceptor wraps handler return in response envelope.
 */
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { GlobalResponseInterceptor } from '../../../../src/shared/interceptors/global-response.interceptor';

describe('GlobalResponseInterceptor', () => {
  let interceptor: GlobalResponseInterceptor;

  beforeEach(() => {
    interceptor = new GlobalResponseInterceptor();
  });

  it('wraps raw data as success envelope', (done) => {
    const mockCtx = {
      switchToHttp: () => ({ getRequest: () => ({}), getResponse: () => ({}) }),
    };
    const ctx = mockCtx as ExecutionContext;
    const next: CallHandler = { handle: () => of({ id: '1' }) };
    interceptor.intercept(ctx, next).subscribe((res) => {
      expect(res).toEqual({ status: 'success', message: 'OK', data: { id: '1' } });
      done();
    });
  });

  it('wraps { data, pagination } as successPaginated', (done) => {
    const mockCtx = {
      switchToHttp: () => ({ getRequest: () => ({}), getResponse: () => ({}) }),
    };
    const ctx = mockCtx as ExecutionContext;
    const pagination = { total: 10, count: 2, limit: 20, totalPages: 1, currentPage: 1 };
    const next: CallHandler = { handle: () => of({ data: [{ id: '1' }, { id: '2' }], pagination }) };
    interceptor.intercept(ctx, next).subscribe((res) => {
      expect(res.status).toBe('success');
      expect(res.data).toHaveLength(2);
      expect(res.pagination).toEqual(pagination);
      done();
    });
  });
});
