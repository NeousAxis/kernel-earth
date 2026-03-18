import { useState, useEffect, useMemo } from 'react';
import * as ss from 'simple-statistics';

interface KernelParams {
  L: number;
  tau1: number;
  tau2: number;
  a: number;
  kappa: number;
}

export const useClimateCoupling = (rawData: any) => {
  const [params, setParams] = useState<KernelParams>({ L: 2, tau1: 14, tau2: 7, a: 0.7, kappa: 10 });

  useEffect(() => {
    if (rawData?.params) {
      setParams(rawData.params);
    }
  }, [rawData]);

  const countriesWithCI = useMemo(() => {
    if (!rawData || !rawData.countries) return { countries: {}, kernel: [], ci_global: 0 };

    const D = 30; // Kernel Horizon
    const { L, tau1, tau2, a } = params;
    
    // 1. Re-generate Kernel
    const kernel = Array.from({ length: D }, (_, delta) => {
      if (delta < L) return 0;
      const d_eff = delta - L;
      return a * Math.exp(-d_eff / tau1) + (1 - a) * Math.exp(-d_eff / tau2);
    });
    
    const sumK = kernel.reduce((acc, v) => acc + v, 0);
    const normalizedKernel = kernel.map(v => sumK > 0 ? v / sumK : 0);

    const processedCountries: any = {};
    
    Object.keys(rawData.countries).forEach(code => {
      const country = rawData.countries[code];
      const psy_res = country.psy_res;
      const atm = country.atm;
      const n = psy_res.length;

      // 2. Convolution in real-time
      const psy_conv = new Array(n).fill(0);
      for (let t = 0; t < n; t++) {
        let sum = 0;
        for (let delta = 0; delta < D; delta++) {
          if (t - delta >= 0) {
            sum += psy_res[t - delta] * normalizedKernel[delta];
          }
        }
        psy_conv[t] = sum;
      }

      // 3. Rolling Correlation (Dynamic CI)
      const windowSize = 21; // 3 weeks window
      const ci_series = new Array(n).fill(0);
      
      for (let i = windowSize; i < n; i++) {
        try {
          const slicePsy = psy_conv.slice(i - windowSize, i);
          const sliceAtm = atm.slice(i - windowSize, i);
          const r = ss.sampleCorrelation(slicePsy, sliceAtm);
          // Only show positive correlation as coupling
          ci_series[i] = r > 0 ? (r * r) : 0;
        } catch (e) {
          ci_series[i] = 0;
        }
      }

      processedCountries[code] = {
        ...country,
        psy_conv,
        ci_series
      };
    });

    const countries = Object.values(processedCountries);
    const global_ci_series = Array.from({ length: rawData.countries['FR'].dates.length }, (_, t) => {
      const sum = countries.reduce((acc: number, c: any) => acc + (c.ci_series[t] || 0), 0);
      return sum / (countries.length || 1);
    });

    return { 
      countries: processedCountries, 
      kernel: normalizedKernel,
      ci_global_series: global_ci_series
    };
  }, [rawData, params]);

  return { 
    params, 
    setParams, 
    computed: countriesWithCI 
  };
};
