import { FiltroPipe } from './filtro.pipe';

interface TestItem {
  nombre: string;
  edad: number;
  activo: boolean;
}

describe('FiltroPipe', () => {
  let pipe: FiltroPipe;
  let items: TestItem[];

  beforeEach(() => {
    pipe = new FiltroPipe();
    items = [
      { nombre: 'Juan', edad: 25, activo: true },
      { nombre: 'María', edad: 30, activo: false },
      { nombre: 'Pedro', edad: 25, activo: true },
      { nombre: 'Ana', edad: 35, activo: true }
    ];
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all items when no filter applied', () => {
    expect(pipe.transform(items, 'nombre', '')).toEqual(items);
  });

  it('should return empty array for null items', () => {
    expect(pipe.transform(null, 'nombre', 'test')).toEqual([]);
  });

  it('should filter by string field (case insensitive)', () => {
    const result = pipe.transform(items, 'nombre', 'mar');
    expect(result.length).toBe(1);
    expect(result[0].nombre).toBe('María');
  });

  it('should filter by numeric field', () => {
    const result = pipe.transform(items, 'edad', 25);
    expect(result.length).toBe(2);
    expect(result[0].nombre).toBe('Juan');
    expect(result[1].nombre).toBe('Pedro');
  });

  it('should filter by boolean field', () => {
    const result = pipe.transform(items, 'activo', true);
    expect(result.length).toBe(3);
  });

  it('should return empty array when no matches', () => {
    const result = pipe.transform(items, 'nombre', 'NoExiste');
    expect(result.length).toBe(0);
  });
});
