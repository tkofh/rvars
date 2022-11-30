import { defineConditions } from '../../../src'

window.addEventListener('load', () => {
  const root = document.createElement('ul')
  const listItems = {
    mobile: document.createElement('li'),
    tablet: document.createElement('li'),
    laptop: document.createElement('li'),
    desktop: document.createElement('li'),
  }
  root.appendChild(listItems.mobile)
  listItems.mobile.setAttribute('id', 'mobile')
  root.appendChild(listItems.tablet)
  listItems.tablet.setAttribute('id', 'tablet')
  root.appendChild(listItems.laptop)
  listItems.laptop.setAttribute('id', 'laptop')
  root.appendChild(listItems.desktop)
  listItems.desktop.setAttribute('id', 'desktop')

  const conditions = defineConditions({
    breakpoints: {
      mobile: {},
      tablet: { min: 768 },
      laptop: { min: 1153 },
      desktop: { min: 1536 },
    },
    fallback: 'mobile',
  })

  for (const [breakpoint, state] of conditions.state.entries()) {
    listItems[breakpoint].textContent = String(state)
  }

  conditions.addEventListener('change', (event) => {
    for (const [breakpoint, state] of event.entries()) {
      listItems[breakpoint].textContent = String(state)
    }
  })

  document.body.appendChild(root)
})
