import sys
import re
import random
class MyClass:


    def main():
        argu = []
        for arg in sys.argv:
            argu.append(arg)
    
        if len(argu) != 2:
            print "Zla ilosc parametrow"
            print str(len(argu))
            return
        else:
             tab = []
             plik = open(argu[1])
             source = plik.readlines()

             
             p1 = open('nazwa1.log','w')
             p2 = open('nazwa2.log','w')
             p3 = open('nazwa3.log','w')
             p4 = open('nazwa4.log','w')
             p5 = open('nazwa5.log','w')
             p6 = open('nazwa6.log','w')
             p7 = open('nazwa7.log','w')
             p8 = open('nazwa8.log','w')
             p9 = open('nazwa9.log','w')
             p10 = open('nazwa10.log','w')


             
             s1 = 'CURRENT HOST STATE: '
             s2 = 'CURRENT SERVICE STATE: '
             s3 = 'SERVICE ALERT: '
             s4 = 'SERVICE FLAPPING ALER: '
             s5 = 'HOST ALERT: '
             r = '[1427897426] SERVICE ALERT: GNBVTM004;Card Printer status;CRITICAL;SOFT;1;(Return code of 13 is out of bounds)'
             r1 = r.find(s3)
             r2 = r.find(';',1)
             for line in source:
                 wsk = line.find(s1)
                 if(wsk != -1):
                     wsk1 = line.find(';',1)
                     newName = line[wsk+len(s1):wsk1]
                     if not newName in tab:
                         tab.append(newName)
                 wsk = line.find(s2)
                 if(wsk != -1):
                     wsk1 = line.find(';',1)
                     newName = line[wsk+len(s2):wsk1]
                     if not newName in tab:
                         tab.append(newName)
                 wsk = line.find(s3)
                 if(wsk != -1):
                     wsk1 = line.find(';',1)
                     newName = line[wsk+len(s3):wsk1]
                     if not newName in tab:
                         tab.append(newName)
                 wsk = line.find(s4)
                 if(wsk != -1):
                     wsk1 = line.find(';',1)
                     newName = line[wsk+len(s4):wsk1]
                     if not newName in tab:
                         tab.append(newName)
                 wsk = line.find(s5)
                 if(wsk != -1):
                     wsk1 = line.find(';',1)
                     newName = line[wsk+len(s5):wsk1]
                     if not newName in tab:
                         tab.append(newName)

             licznik = 1
             tmpLicznik = 1
             for c in range(0,160):
                 p1.write(tab[c])
                 p1.write(';')
                 if licznik < 10:
                     p1.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p1.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
             licznik = 1
             tmpLicznik = 1
             for c in range(160,320):
                 p2.write(tab[c])
                 p2.write(';')
                 if licznik < 10:
                     p2.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p2.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
             licznik = 1
             tmpLicznik = 1
             for c in range(320,480):
                 p3.write(tab[c])
                 p3.write(';')
                 if licznik < 10:
                     p3.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p3.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
                     
             licznik = 1
             tmpLicznik = 1
             for c in range(160):
                 p4.write(random.choice(tab))
                 p4.write(';')
                 if licznik < 10:
                     p4.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p4.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
             licznik = 1
             tmpLicznik = 1
             for c in range(160):
                 p5.write(random.choice(tab))
                 p5.write(';')
                 if licznik < 10:
                     p5.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p5.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
             licznik = 1
             tmpLicznik = 1
             for c in range(160):
                 p6.write(random.choice(tab))
                 p6.write(';')
                 if licznik < 10:
                     p6.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p6.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1                     
             licznik = 1
             tmpLicznik = 1
             for c in range(160):
                 p7.write(random.choice(tab))
                 p7.write(';')
                 if licznik < 10:
                     p7.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p7.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
             licznik = 1
             tmpLicznik = 1
             for c in range(160):
                 p8.write(random.choice(tab))
                 p8.write(';')
                 if licznik < 10:
                     p8.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p8.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
             licznik = 1
             tmpLicznik = 1
             for c in range(160):
                 p9.write(random.choice(tab))
                 p9.write(';')
                 if licznik < 10:
                     p9.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p9.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1
             licznik = 1
             tmpLicznik = 1
             for c in range(160):
                 p10.write(random.choice(tab))
                 p10.write(';')
                 if licznik < 10:
                     p10.write(str(tmpLicznik)+'L0'+str(licznik)+'\n')
                 else:
                     p10.write(str(tmpLicznik)+'L'+str(licznik)+'\n')
                 licznik=licznik+1
                 if licznik == 41:
                     licznik = 1
                     tmpLicznik =tmpLicznik+1



                     
             print len(tab)
            

             
             p1.close()
             p2.close()
             p3.close()
             p4.close()
             p5.close()
             p6.close()
             p7.close()
             p8.close()
             p9.close()
             p10.close()
             

             plik.close()
     
    if  __name__ =='__main__':
        main()

