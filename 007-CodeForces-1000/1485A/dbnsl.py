def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def number(): return int(input())
def numbers(): return [int(item) for item in input().split()]

def divs(a, b):
	res = 0
	if b == 1: return 10 ** 10
	while a != 0:
		a //= b
		res += 1
	return res

for t in range(number()):
	a, b = numbers()
	adds = 0
	# Tjänar vi på att addera?
	while divs(a, b+adds) - divs(a, b +adds+1) >= 1: adds += 1
	print(adds + divs(a, b+adds))
