import inAllowedRequestDomains from './inAllowedRequestDomains';

const allowed = ['domain.com', 's.domain.com'];

test('Should allow valid request', () => {
  expect(inAllowedRequestDomains(allowed, 'http://domain.com')).toBe(true);
  expect(inAllowedRequestDomains(allowed, 'https://domain.com')).toBe(true);
  expect(inAllowedRequestDomains(allowed, 'http://domain.com/p')).toBe(true);
  expect(inAllowedRequestDomains(allowed, 'https://domain.com/p')).toBe(true);
  expect(inAllowedRequestDomains(allowed, 'http://s.domain.com')).toBe(true);
  expect(inAllowedRequestDomains(allowed, 'https://s.domain.com')).toBe(true);
  expect(inAllowedRequestDomains(allowed, 'http://s.domain.com/p')).toBe(true);
  expect(inAllowedRequestDomains(allowed, 'https://s.domain.com/p')).toBe(true);
});

test('Should not allow invalid request', () => {
  expect(inAllowedRequestDomains(allowed, 'http://domain.ca')).toBe(false);
  expect(inAllowedRequestDomains(allowed, 'https://domain.ca')).toBe(false);
  expect(inAllowedRequestDomains(allowed, 'http://domain.x')).toBe(false);
  expect(inAllowedRequestDomains(allowed, 'https://domain.x')).toBe(false);
  expect(inAllowedRequestDomains(allowed, 'http://x.com')).toBe(false);
  expect(inAllowedRequestDomains(allowed, 'https://x.com')).toBe(false);
  expect(inAllowedRequestDomains(allowed, 'http://x.domain.com')).toBe(false);
  expect(inAllowedRequestDomains(allowed, 'https://x.domain.com')).toBe(false);
});
