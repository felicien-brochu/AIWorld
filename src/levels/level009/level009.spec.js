import level from './level009'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
fireball(e)
if ne == floor &&
  n == floor :
	step(ne)
endif
if se == floor &&
  s == floor :
	step(se)
endif
step(e)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
a:
step(e)
fireball(e)
if e == hole :
	if ne == floor :
		step(ne)
	else
		step(se)
	endif
endif
jump a
		`,
  }, ]
}