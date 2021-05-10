# reducerar en gigantisk csv-fil medelst slumpning av rader

import random
with open('data\\LeveransTillWSP_75_min_20200915.csv') as f: lines1 = f.readlines()
header = lines1.pop(0)
random.seed(0)
lines2 = [header] + random.sample(lines1,10000)
with open('data\\LeveransTillWSP_75_min_20200915_small.csv',"w") as f: f.writelines(lines2)
