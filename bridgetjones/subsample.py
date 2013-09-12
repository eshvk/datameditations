import sys, json
"""
    Subsample Bridget Jones to give weekly weights. Rewriting R code because I
    don't want to figure out how R writes JSON. 
"""

def main():
        original_json = json.loads(open(sys.argv[1],'r').read())
        subsampled_json = {}
        for ii in range(1,365,7):
                if str(ii) in original_json:
                        subsampled_json[str(ii)] = original_json[str(ii)]
        f = open(sys.argv[1].rstrip('.json') + '_subsampled.json','w') 
        json.dump(subsampled_json,f,indent=0)
if __name__ == "__main__":
	sys.exit(main())
