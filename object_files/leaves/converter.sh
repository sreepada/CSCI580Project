firstFile=$1
secondFile=$2
vCount=`grep -c '^v .*' $firstFile`
vtCount=`grep -c '^vt .*' $firstFile`
vnCount=`grep -c '^vn .*' $firstFile`
echo "$vCount $vtCount $vnCount"
grep '^v .*' $firstFile > combinedLeaf.obj
grep '^v .*' $secondFile >> combinedLeaf.obj
grep '^vt .*' $firstFile >> combinedLeaf.obj
grep '^vt .*' $secondFile >> combinedLeaf.obj
grep '^vn .*' $firstFile >> combinedLeaf.obj
grep '^vn .*' $secondFile >> combinedLeaf.obj
grep '^f .*' $firstFile >> combinedLeaf.obj
grep '^f .*' $secondFile | awk -v v=$vCount -v vt=$vtCount -v vn=$vnCount 'BEGIN{}{
printf("f");
for(i=2;i<=NF;i++){
	split($i,a,"/");
	printf(" %s", (a[1] + v));
	printf("/%s", (a[2] + vt));
	printf("/%s", (a[3] + vn));
}
printf("\n")
}' - >> combinedLeaf.obj
