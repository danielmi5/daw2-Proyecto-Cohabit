import { FechaRelativaPipe } from './fecha-relativa.pipe';

describe('FechaRelativaPipe', () => {
  let pipe: FechaRelativaPipe;

  beforeEach(() => {
    pipe = new FechaRelativaPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return "hace un momento" for recent dates', () => {
    const ahora = new Date();
    expect(pipe.transform(ahora)).toBe('hace un momento');
  });

  it('should return minutes ago', () => {
    const hace5Min = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(hace5Min)).toBe('hace 5 minutos');
  });

  it('should return singular minute', () => {
    const hace1Min = new Date(Date.now() - 1 * 60 * 1000);
    expect(pipe.transform(hace1Min)).toBe('hace 1 minuto');
  });

  it('should return hours ago', () => {
    const hace3Horas = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(pipe.transform(hace3Horas)).toBe('hace 3 horas');
  });

  it('should return days ago', () => {
    const hace2Dias = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(hace2Dias)).toBe('hace 2 días');
  });

  it('should handle string dates', () => {
    const fechaString = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(pipe.transform(fechaString)).toBe('hace 10 minutos');
  });
});
