import { createVariable, defineConditions } from '../../../src'

window.addEventListener('load', () => {
  const root = document.createElement('ul')
  const listItems = {
    mobile: document.createElement('li'),
    tablet: document.createElement('li'),
    laptop: document.createElement('li'),
    desktop: document.createElement('li'),
    variable1: document.createElement('li'),
    variable2: document.createElement('li'),
    variable3: document.createElement('li'),
  }
  root.appendChild(listItems.mobile)
  listItems.mobile.setAttribute('id', 'mobile')
  root.appendChild(listItems.tablet)
  listItems.tablet.setAttribute('id', 'tablet')
  root.appendChild(listItems.laptop)
  listItems.laptop.setAttribute('id', 'laptop')
  root.appendChild(listItems.desktop)
  listItems.desktop.setAttribute('id', 'desktop')
  root.appendChild(listItems.variable1)
  listItems.variable1.setAttribute('id', 'variable')
  root.appendChild(listItems.variable2)
  listItems.variable2.setAttribute('id', 'variable')
  root.appendChild(listItems.variable3)
  listItems.variable3.setAttribute('id', 'variable')

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
    console.log('conditions change', event)
    for (const [breakpoint, state] of event.entries()) {
      listItems[breakpoint].textContent = String(state)
    }
  })

  const variable1 = createVariable(conditions, 'hello', 'fallback')
  listItems.variable1.textContent = variable1.current()
  variable1.addEventListener('change', (value) => {
    listItems.variable1.textContent = String(value)
  })
  const variable2 = createVariable(conditions, ['first', 'second'], 'fallback')
  listItems.variable2.textContent = variable2.current()
  variable2.addEventListener('change', (value) => {
    listItems.variable2.textContent = String(value)
  })
  const variable3 = createVariable<'tablet' | 'laptop' | 'fallback'>(
    conditions,
    { tablet: 'tablet', laptop: 'laptop' },
    'fallback'
  )
  listItems.variable3.textContent = variable3.current()
  variable3.addEventListener('change', (value) => {
    listItems.variable3.textContent = String(value)
  })

  console.log(conditions)
  console.log(variable1)

  console.log(conditions.normalize('a', 'b'))

  document.body.appendChild(root)
})
