t=parseInt(readline())
for(_=0;_<t;_++){
	c=0
	s=readline()
	for(i=0;i<s.length;i++)c+=s[i]=='B'&&c>0?-1:1
	print(c)
}
