import level from './level310'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
if n == wall :
	a:
	listen("hey")
	if w == wall ||
	  sw == hero :
		step(s)
		b:
		$a = calc($a + 1)
		if e == nothing :
			write($a)
		endif
		jump b
	endif
	jump a
endif
c:
tell("hey" everyone)
$a = set(here)
d:
if $a > 1 ||
  here >= 4 &&
  $a > 0 :
	$a = calc($a - 1)
	jump d
endif
step(e)
jump c
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_all_hero_ended',
    frequency: 1,
    code: `
step(s)
step(s)
		`,
  }, ]
}