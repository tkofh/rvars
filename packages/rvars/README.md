# rvars

Create responsive JS values based on media query conditions

```typescript
import { defineConditions, createVariable } from 'rvars'

const conditions = defineCondtions({
  breakpoints: {
    mobile: {},
    tablet: { min: 768 },
    desktop: { min: 1280 },
  },

  // optional
  fallback: 'mobile',

  // optional
  responsiveArray: ['mobile', 'tablet', 'desktop'],
})

conditions.normalize(10)
// { mobile: 10, tablet: undefined, laptop: undefined }

conditions.normalize(['small', 'medium', 'large'])
// { mobile: 'small', tablet: 'medium', laptop: 'large' }

conditions.normalize({ tablet: true })
// { mobile: undefined, tablet: true, laptop: true }

conditions.fill({ tablet: true }, false)
// { mobile: false, tablet: true, laptop: true }

conditions.optimize({ mobile: 'large', tablet: 'large', laptop: 'medium' })
// { mobile: 'large', tablet: undefined, laptop: 'medium' }
```
