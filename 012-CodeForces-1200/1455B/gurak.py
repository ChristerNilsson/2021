import math
def f(k):
	n=round(math.sqrt(2*k)) # snabb men felaktig ibland
	if n*(n+1)//2==k+1:n+=1 # patch!
	return n
for _ in range(int(input())):print(f(int(input())))

# Bygg en långsam, men korrekt funktion, t ex bredden först
# Bygg en snabb men felaktig version
# Patcha den snabba versionen tills den stämmer med den långsamma
