# Earthquake Prediction Algorithm - Technical Documentation

## Overview

This document describes the improved earthquake prediction algorithm implemented in `src/lib/prediction.ts`. The algorithm is based on established seismological research and real-world data patterns from the USGS earthquake catalog.

## Key Improvements

### 1. Scientific Foundation

The new algorithm implements multiple peer-reviewed seismological models:

- **Omori's Law (1894)** - Aftershock timing
- **Båth's Law (1965)** - Aftershock magnitude
- **Gutenberg-Richter Law** - Magnitude-frequency distribution
- **Rupture Length Scaling** - Spatial distribution
- **ETAS Model** - Epidemic-Type Aftershock Sequence concepts

### 2. Comparison with Previous Algorithm

| Feature | Old Algorithm | New Algorithm |
|---------|--------------|---------------|
| Aftershock Count | Random 1-2 for M>5.0 | Magnitude-dependent (3-25) |
| Magnitude Calculation | Fixed 60-80% of mainshock | Båth's Law + Gutenberg-Richter |
| Spatial Distribution | Random within 50km | Rupture-length scaled |
| Time Distribution | Uniform (next 24h) | Omori's Law (up to 7 days) |
| Additional Features | None | Swarm detection, seismic gaps |
| Scientific Basis | None | Multiple peer-reviewed models |

## Algorithm Components

### Aftershock Predictions

#### Magnitude Calculation

**Båth's Law** states that the largest aftershock is typically 1.2 magnitudes less than the mainshock:

```
M_aftershock = M_mainshock - 1.2 (±0.3)
```

Additional aftershocks follow the **Gutenberg-Richter distribution**, with smaller aftershocks being exponentially more common.

#### Count Estimation

The number of aftershocks scales with mainshock magnitude:

- M ≥ 7.0: 15-25 aftershocks
- M ≥ 6.0: 8-15 aftershocks
- M ≥ 5.0: 3-8 aftershocks

This is based on the empirical relationship: `N ≈ 10^(α(M - M_min))`

#### Spatial Distribution

Aftershocks cluster around the rupture zone. The rupture length is calculated using:

```
log10(L) = 0.5 * M - 1.8
```

Where L is the rupture length in km. Aftershocks are distributed within approximately 2× the rupture length using a power-law distribution (closer events are more likely).

**Example:**
- M6.5 earthquake: Rupture length ~32km, aftershocks within ~64km
- M7.2 earthquake: Rupture length ~100km, aftershocks within ~200km

#### Temporal Distribution

**Omori's Law** describes how aftershock rate decreases over time:

```
n(t) = K / (c + t)^p
```

Where:
- t = time since mainshock
- K = productivity parameter (~10)
- c ≈ 0.1 days
- p ≈ 1.1

The algorithm uses a power-law distribution to generate prediction times, with most aftershocks occurring in the first 24 hours and predictions extending up to 7 days.

### Swarm Detection

The algorithm identifies earthquake swarms - clusters of earthquakes in the same location:

1. Groups earthquakes within 1° radius (~111 km)
2. Identifies clusters with ≥3 events
3. Calculates cluster center and average depth
4. For clusters with ≥5 events, predicts a potential larger event (M_avg + 1.0 to 1.5) within 3-7 days

**Rationale:** Earthquake swarms can indicate magma movement, fluid injection, or stress accumulation that may precede a larger event.

### Seismic Gap Analysis

The algorithm monitors high-risk zones along the Pacific Ring of Fire and major fault systems:

- Japan Trench
- San Andreas Fault, California
- Cascadia Subduction Zone
- Himalayan Front
- Peru-Chile Trench
- Sumatra Subduction Zone
- New Zealand Alpine Fault

For zones with no recent major activity (M≥5.0 in last 30 days), the algorithm:
1. Identifies potential strain accumulation
2. Generates long-term predictions (M5.5-7.0)
3. Provides 30-day forecasts (with appropriate uncertainty)

**Note:** Long-term earthquake prediction is inherently uncertain. These predictions indicate areas of elevated risk, not specific event predictions.

### Alert Level Determination

Alert levels are assigned based on magnitude and depth:

```
Red:   M ≥ 7.0, or M ≥ 6.0 && depth < 70km
Yellow: M ≥ 5.0
Green: M < 5.0
```

Shallow earthquakes (< 70km depth) are more dangerous due to stronger surface shaking.

## Data Sources

### Real Earthquake Data

The app fetches real-time data from the USGS Earthquake Catalog API:

```
https://earthquake.usgs.gov/fdsnws/event/1/query
```

Parameters:
- Format: GeoJSON
- Time range: Configurable (hour/day/week)
- Minimum magnitude: Configurable
- Limit: 200 events

### Historical Patterns

The algorithm's parameters are calibrated based on:
- USGS historical earthquake catalog
- Peer-reviewed seismological research
- Observed aftershock sequences (e.g., 2011 Tohoku, 1989 Loma Prieta, 2010 Chile)

## Scientific References

1. **Omori, F. (1894).** "On the aftershocks of earthquakes." Journal of the College of Science, Imperial University of Tokyo.

2. **Båth, M. (1965).** "Lateral inhomogeneities in the upper mantle." Tectonophysics, 2(6), 483-514.

3. **Gutenberg, B., & Richter, C. F. (1944).** "Frequency of earthquakes in California." Bulletin of the Seismological Society of America, 34(4), 185-188.

4. **Wells, D. L., & Coppersmith, K. J. (1994).** "New empirical relationships among magnitude, rupture length, rupture width, rupture area, and surface displacement." Bulletin of the Seismological Society of America, 84(4), 974-1002.

5. **Ogata, Y. (1988).** "Statistical models for earthquake occurrences and residual analysis for point processes." Journal of the American Statistical Association, 83(401), 9-27.

6. **Utsu, T., Ogata, Y., & Matsu'ura, R. S. (1995).** "The centenary of the Omori formula for a decay law of aftershock activity." Journal of Physics of the Earth, 43(1), 1-33.

7. **Field, E. H., et al. (2013).** "Uniform California Earthquake Rupture Forecast, Version 3 (UCERF3)." USGS Open-File Report 2013-1165.

## Limitations and Uncertainties

1. **Short-term predictions only:** The algorithm focuses on aftershock prediction (hours to days), not long-term earthquake forecasting.

2. **Probabilistic, not deterministic:** Predictions represent likely scenarios based on statistical models, not guaranteed events.

3. **Seismic gaps are uncertain:** While zones without recent activity may have accumulated strain, this doesn't guarantee an earthquake will occur in the predicted timeframe.

4. **Model simplifications:** Real earthquake processes are complex. The algorithm uses simplified models that capture major trends but not all details.

5. **No precursory signals:** Current science cannot reliably predict earthquakes before they occur. This algorithm predicts aftershocks, not mainshocks.

## Usage in the Application

### Enabling Predictions

1. Click the "🔮 Predictions" button in the filter bar
2. Predicted earthquakes appear in purple on the map
3. Predictions are sorted by time (nearest first)

### Understanding Predictions

- **Aftershock predictions:** High confidence for M≥5.0 mainshocks in the first 24-72 hours
- **Swarm predictions:** Moderate confidence when ≥5 events detected in close proximity
- **Seismic gap predictions:** Low confidence, represents elevated risk rather than specific event

## Testing

Run the test script to see algorithm behavior:

```bash
node test-predictions.js
```

This demonstrates predictions for various earthquake scenarios using mock data.

## Future Improvements

Potential enhancements based on ongoing research:

1. **Machine Learning:** Train models on historical earthquake catalog data
2. **Real-time stress modeling:** Incorporate GPS deformation data
3. **Foreshock analysis:** Identify potential precursory activity patterns
4. **Enhanced ETAS:** Full implementation of Epidemic-Type Aftershock Sequence model
5. **Regional customization:** Tune parameters for specific tectonic regions
6. **Uncertainty quantification:** Provide confidence intervals for predictions

## Contact & Contributions

For questions, suggestions, or contributions related to the prediction algorithm, please open an issue or pull request on the repository.
