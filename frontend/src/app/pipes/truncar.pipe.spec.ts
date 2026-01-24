import { TruncarPipe } from './truncar.pipe';

describe('TruncarPipe', () => {
  let pipe: TruncarPipe;

  beforeEach(() => {
    pipe = new TruncarPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should not truncate short text', () => {
    const texto = 'Texto corto';
    expect(pipe.transform(texto, 50)).toBe(texto);
  });

  it('should truncate long text with default limit', () => {
    const texto = 'Este es un texto muy largo que debería ser truncado porque supera el límite de caracteres establecido';
    const resultado = pipe.transform(texto);
    expect(resultado.length).toBeLessThan(texto.length);
    expect(resultado.endsWith('...')).toBe(true);
  });

  it('should truncate with custom limit', () => {
    const texto = 'Este es un texto largo';
    const resultado = pipe.transform(texto, 10);
    expect(resultado).toBe('Este es un...');
  });

  it('should use custom suffix', () => {
    const texto = 'Este es un texto largo';
    const resultado = pipe.transform(texto, 10, '>>>');
    expect(resultado).toBe('Este es un>>>');
  });

  it('should trim whitespace before adding suffix', () => {
    const texto = 'Este es un texto con espacios';
    const resultado = pipe.transform(texto, 12);
    expect(resultado).toBe('Este es un...');
  });
});
