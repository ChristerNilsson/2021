import random
import time
n = 20
antal = 0
for i in range(10):
    print()
    start = time.time()
    a = random.randint(-n,n)
    b = random.randint(-n,n)
    print('a*b',a*b)
    print('a+b',a+b)
    both = [-99999,-99999]
    while both != [a,b] and both != [b,a]:
        antal += 1
        answer = input('Gissa:')
        c,d = answer.split(" ")
        both = [int(c),int(d)]
    print('Grattis!',time.time()-start, antal)
