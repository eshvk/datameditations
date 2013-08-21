import sys, json, re, datetime
"""
	Bridget Jones's diaries have a specific structure with each
	page having a time stamp. There are lines which start with 
	her weight and a comment. This extracts them and puts them in
	gists. 
	Pass text file. 
"""

def cdate(date):
	week_day, day, month = date.split(' ')
	day = day.zfill(2)
	date = day + ' ' +  month + ' 1996'
	return datetime.datetime.strptime(date,'%d %B %Y')

def pagify(diary):
	pages = {}
	p = re.compile('^[a-zA-Z]+\s{1}\d+\s{1}[a-zA-Z]+\n',\
					re.I|re.M)
	dates = p.findall(diary)
	dates = [d.rstrip('\n') for d in dates]
	content = p.split(diary)[1:]
	jj = 1
	for ii in xrange(0, len(dates)):
		curr_date = cdate (dates[ii])
		if pages:
			prev_date = cdate (dates[ii-1])
			delta = curr_date - prev_date
			jj += delta.days
		gist = gistify(content[ii])
		if gist != None:
			pages[jj] = {'date': dates[ii]}
			pages[jj].update(gist)
	return pages

def poundify(stones):
	stone, pound = stones.split('st')
	if pound:
		lb = 14 * int(stone) + int(pound)
	else:
		lb = 14 * int(stone) 
	return lb

def gistify(content):
	# Generates gists of a page 
	p = re.compile('^\d+st\s{1}\d+|^\d+st')
	weight = p.match(content)
	if weight is None:
		return None
	else:
		summary = p.split(content)[1].split('\n')[0]
		pounds = poundify(weight.group().rstrip())
		summary = str(pounds) + 'lb ' + summary
		return {'weight': pounds, 'summary': summary}


def main():
	diary = open(sys.argv[1],'r').read()
	pages = pagify(diary)
	f = open(sys.argv[1].rstrip('.txt') + '.json','w')
	json.dump(pages,f,indent=0)

if __name__ == "__main__":
	sys.exit(main())