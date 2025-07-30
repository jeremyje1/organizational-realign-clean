/**
 * Test suite for simplified algorithm pattern
 * Validates the exact pattern specified in requirements
 */

import { runAlgorithms, calcDSCH, calcCRF, calcLEI, AlgorithmPayload } from '../lib/algorithms';

describe('Simplified Algorithm Pattern', () => {
  const testPayload: AlgorithmPayload = {
    structure: {
      layers: 4,
      spanByMgr: [6, 8, 5, 12, 4]
    },
    culture: {
      cultureMetrics: {
        adaptability: 0.8,
        cohesion: 0.7,
        innovation: 0.9
      }
    },
    licenses: {
      leadership: 0.85,
      effectiveness: 0.75,
      impact: 0.8
    }
  };

  test('runAlgorithms should match exact pattern from requirements', async () => {
    const results = await runAlgorithms(testPayload);
    
    // Verify structure matches requirements: { dsch: calcDSCH(...), crf: calcCRF(...), lei: calcLEI(...) }
    expect(results).toHaveProperty('dsch');
    expect(results).toHaveProperty('crf');
    expect(results).toHaveProperty('lei');
    
    // Verify DSCH result structure
    expect(results.dsch).toHaveProperty('score');
    expect(results.dsch).toHaveProperty('idealSpan');
    expect(typeof results.dsch.score).toBe('number');
    expect(typeof results.dsch.idealSpan).toBe('number');
    
    // Verify CRF result structure
    expect(results.crf).toHaveProperty('score');
    expect(typeof results.crf.score).toBe('number');
    
    // Verify LEI result structure
    expect(results.lei).toHaveProperty('score');
    expect(typeof results.lei.score).toBe('number');
  });

  test('calcDSCH should calculate span-of-control metrics', () => {
    const result = calcDSCH(testPayload.structure);
    
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.idealSpan).toBeGreaterThan(0);
    expect(result.idealSpan).toBeLessThan(20);
  });

  test('calcCRF should calculate cultural resilience', () => {
    const result = calcCRF(testPayload.culture);
    
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('calcLEI should calculate leadership effectiveness', () => {
    const result = calcLEI(testPayload.licenses);
    
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('individual algorithms should match results from runAlgorithms', async () => {
    const runResults = await runAlgorithms(testPayload);
    const individualDSCH = calcDSCH(testPayload.structure);
    const individualCRF = calcCRF(testPayload.culture);
    const individualLEI = calcLEI(testPayload.licenses);
    
    expect(runResults.dsch).toEqual(individualDSCH);
    expect(runResults.crf).toEqual(individualCRF);
    expect(runResults.lei).toEqual(individualLEI);
  });

  test('algorithms should handle edge cases', () => {
    const edgePayload: AlgorithmPayload = {
      structure: {
        layers: 1,
        spanByMgr: [50] // Very high span
      },
      culture: {
        cultureMetrics: {
          adaptability: 0,
          cohesion: 0,
          innovation: 0
        }
      },
      licenses: {
        leadership: 1,
        effectiveness: 1,
        impact: 1
      }
    };

    expect(() => calcDSCH(edgePayload.structure)).not.toThrow();
    expect(() => calcCRF(edgePayload.culture)).not.toThrow();
    expect(() => calcLEI(edgePayload.licenses)).not.toThrow();
  });
});
