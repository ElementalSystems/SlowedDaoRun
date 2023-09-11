(() => {
	let argToElements = function(src) {
		if (typeof src === 'string') {
			const tagName = /^<(\w+)>$/.exec(src)
			if (tagName !== null) {
				if (['path','g','svg'].includes(tagName[1])) return [document.createElementNS('http://www.w3.org/2000/svg',tagName[1])];
				return [document.createElement(tagName[1])]
			} else {
				return [...document.querySelectorAll(src)]
			}
		} else if (src instanceof HTMLElement) {
			return [src]
		} else if (Array.isArray(src)) {
			const elems = []
			src.forEach(i => elems.push(...argToElements(i)))
			return elems
		} else if ('isFemtoJS' in src) {
			return src.sel()
		}

		throw TypeError('Expected string | HTMLElement | Array | femtoJS,' +
		                ' got ' + typeof src)
	}

	const $ = function(...src) {
		let sel = argToElements(src)
		let iter = sel.forEach.bind(sel)

		let insertToAdjacent =
			(s) => function(e) {
				iter((j, i) => i === 0
				               ? e instanceof HTMLElement
				                 ? e.insertAdjacentElement(s, j)
				                 : e.sel()[0].insertAdjacentElement(s, j)
				               : sel[0].insertAdjacentElement('afterend', j))

				return this
			}

		let insertAdjacent =
			(s) => function(sOrE) {
				if (typeof sOrE !== 'string') {
					if (sOrE instanceof HTMLElement) {
						sel[0].insertAdjacentElement(s, sOrE)
					} else if ('isFemtoJS' in sOrE) {
						const osel = sOrE.sel()

						sel[0].insertAdjacentElement(s, osel[0])

						for (let i = 1; i < osel.length; i++) {
							osel[0].insertAdjacentElement('afterend', osel[i])
						}
					}
				} else {
					sel[0].insertAdjacentHTML(s, sOrE)
				}

				return this
			}

		return {
			on:   function(type, fn) { iter(i => i.addEventListener(type, fn, false)); return this },
			css:         function(s) { iter(i => i.style.cssText += s);                return this },
			html:        function(h) { iter(i => i.innerHTML = h);                     return this },
			text:        function(t) { iter(i => i.innerText = t);                     return this },
			textC:        function(t) { iter(i => i.textContent = t);                     return this },
			addClass:    function(t) { iter(i => i.classList.add(t));                  return this },
			addClasses:  function(l) { l?.split(' ').forEach(t=>{ iter(i => i.classList.toggle(t,true));  }); return this;},
			emptyClass:  function() {iter(i => i.className=''); return this; },
			toggleClass: function(t) { iter(i => i.classList.toggle(t));               return this },
			removeClass: function(t) { iter(i => i.classList.remove(t));               return this },
			empty:        function() { iter(i => i.innerHTML = '');                    return this },
			attr:     function(k, v) { iter(i => i.setAttribute(k, v));                return this },			
			removeAttr:  function(k) { iter(i => i.removeAttribute(k));                return this },
			parent:       function() { iter((e, i) => { sel[i] = e.parentNode });      return this },
			remove:       function() { iter(i => i.remove());                          return this },

			before:       insertAdjacent('beforebegin'),
			after:        insertAdjacent('afterend'),
			first:        insertAdjacent('afterbegin'),
			last:         insertAdjacent('beforeend'),
			insertBefore: insertToAdjacent('beforebegin'),
			insertAfter:  insertToAdjacent('afterend'),
			insertFirst:  insertToAdjacent('afterbegin'),
			insertLast:   insertToAdjacent('beforeend'),

			prepend:      insertAdjacent('afterbegin'),
			append:       insertAdjacent('beforeend'),

			getAttr: v => sel[0].getAttribute(v),
			value: () => sel[0].value,
			setValue: (v) => sel[0].value=v,
			offset: () => sel[0].getBoundingClientRect(),
			sel:    () => sel,			

			isFemtoJS: true
		}
	}

	$.fragment = () => $(document.createDocumentFragment())

	window.$ = $
})()
